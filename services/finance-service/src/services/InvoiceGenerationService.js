'use strict';

const Invoice = require('../models/Invoice.model');
const LedgerEntry = require('../models/LedgerEntry.model');
const env = require('../config/env');
const publisher = require('../events/publisher');
const logger = require('../utils/logger');

class InvoiceGenerationService {
  /**
   * Creates an invoice for the admission application fee.
   */
  async createApplicationFeeInvoice({ applicationId, userId, email }) {
    const amount = env.APPLICATION_FEE_AMOUNT;
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const invoice = await Invoice.create({
      userId,
      amount,
      currency: env.DEFAULT_CURRENCY,
      purpose: 'APPLICATION_FEE',
      referenceId: applicationId,
      status: 'UNPAID',
      dueDate,
    });

    // Debit student account in ledger
    await LedgerEntry.create({
      accountId: `STUDENT:${userId}`,
      entryType: 'DEBIT',
      amount,
      description: `Application fee invoice for application ${applicationId}`,
      invoiceId: invoice._id,
    });

    await publisher.publish('finance.events', {
      eventType: 'finance.invoice_generated',
      payload: { invoiceId: invoice._id.toString(), userId, email, amount, currency: env.DEFAULT_CURRENCY, purpose: 'APPLICATION_FEE' },
    });

    logger.info('[FinanceService] Application fee invoice generated', { invoiceId: invoice._id, userId });
    return invoice;
  }

  /**
   * Creates a tuition fee invoice based on academic course credits.
   */
  async createTuitionInvoice({ enrollmentId, studentId, courseCredits }) {
    const amount = courseCredits * env.TUITION_FEE_PER_CREDIT;
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days due

    const invoice = await Invoice.create({
      userId: studentId,
      amount,
      currency: env.DEFAULT_CURRENCY,
      purpose: 'TUITION_FEE',
      referenceId: enrollmentId,
      status: 'UNPAID',
      dueDate,
    });

    await LedgerEntry.create({
      accountId: `STUDENT:${studentId}`,
      entryType: 'DEBIT',
      amount,
      description: `Tuition invoice for enrollment ${enrollmentId} (${courseCredits} credits)`,
      invoiceId: invoice._id,
    });

    await publisher.publish('finance.events', {
      eventType: 'finance.invoice_generated',
      payload: { invoiceId: invoice._id.toString(), userId: studentId, amount, currency: env.DEFAULT_CURRENCY, purpose: 'TUITION_FEE' },
    });

    logger.info('[FinanceService] Tuition invoice generated', { invoiceId: invoice._id, studentId });
    return invoice;
  }

  /**
   * Records a payment, updates invoice status, and adds a credit ledger entry.
   */
  async recordPayment({ invoiceId, transactionId }) {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) throw new Error('Invoice not found');
    if (invoice.status === 'PAID') return invoice;

    invoice.status = 'PAID';
    invoice.paidAt = new Date();
    invoice.transactionId = transactionId;
    await invoice.save();

    // Credit student account (reducing their debt)
    await LedgerEntry.create({
      accountId: `STUDENT:${invoice.userId}`,
      entryType: 'CREDIT',
      amount: invoice.amount,
      description: `Payment received for invoice ${invoiceId}`,
      invoiceId: invoice._id,
    });

    // Offset into Revenue Account
    await LedgerEntry.create({
      accountId: `REVENUE:${invoice.purpose}`,
      entryType: 'CREDIT',
      amount: invoice.amount,
      description: `Revenue recognized from invoice ${invoiceId}`,
      invoiceId: invoice._id,
    });

    await publisher.publish('finance.events', {
      eventType: 'finance.payment_completed',
      payload: {
        invoiceId: invoice._id.toString(),
        userId: invoice.userId,
        amount: invoice.amount,
        currency: invoice.currency,
        purpose: invoice.purpose,
        referenceId: invoice.referenceId,
        transactionId,
      },
    });

    logger.info('[FinanceService] Invoice marked paid and ledger entries balanced', { invoiceId });
    return invoice;
  }

  async getStudentBalance(userId) {
    const entries = await LedgerEntry.find({ accountId: `STUDENT:${userId}` });
    const balance = entries.reduce((acc, entry) => {
      return entry.entryType === 'DEBIT' ? acc + entry.amount : acc - entry.amount;
    }, 0);
    return { balance, currency: env.DEFAULT_CURRENCY };
  }
}

module.exports = new InvoiceGenerationService();
