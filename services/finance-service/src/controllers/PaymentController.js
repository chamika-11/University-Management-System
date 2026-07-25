'use strict';

const invoiceService = require('../services/InvoiceGenerationService');
const Invoice = require('../models/Invoice.model');
const LedgerEntry = require('../models/LedgerEntry.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');

class PaymentController {
  /**
   * Simulates an external payment gateway transaction (Stripe/PayPal).
   */
  processPayment = asyncHandler(async (req, res) => {
    const { invoiceId, cardNumber } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) throw AppError.notFound('Invoice');
    if (invoice.status === 'PAID') throw AppError.badRequest('Invoice is already paid', 'ALREADY_PAID');

    // Simulate gateway success card check
    if (cardNumber && cardNumber.startsWith('4111')) {
      throw AppError.badRequest('Card declined by gateway', 'PAYMENT_DECLINED');
    }

    const transactionId = `TXN-${uuidv4().slice(0, 8).toUpperCase()}`;
    const updatedInvoice = await invoiceService.recordPayment({ invoiceId, transactionId });

    res.status(200).json({
      success: true,
      data: {
        message: 'Payment processed successfully',
        invoice: updatedInvoice,
      },
    });
  });

  getLedger = asyncHandler(async (req, res) => {
    const accountId = req.params.accountId || `STUDENT:${req.user.id}`;
    const entries = await LedgerEntry.find({ accountId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { ledger: entries } });
  });

  getBalance = asyncHandler(async (req, res) => {
    const userId = req.params.userId || req.user.id;
    const balance = await invoiceService.getStudentBalance(userId);
    res.status(200).json({ success: true, data: balance });
  });
}

module.exports = new PaymentController();
