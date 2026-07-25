'use strict';

const invoiceService = require('../../services/InvoiceGenerationService');
const logger = require('../../utils/logger');

/**
 * When academic-service registers a pending enrollment, bill tuition.
 * For this demo, we assume default 3 credits per course for fee calculation.
 */
module.exports = {
  canHandle: (event) => event.eventType === 'academic.enrollment_requested',

  async handle(event) {
    const { enrollmentId, studentId } = event.payload;
    logger.info('[Handler] academic.enrollment_requested received — billing tuition', { enrollmentId });

    try {
      await invoiceService.createTuitionInvoice({
        enrollmentId,
        studentId,
        courseCredits: 3,
      });
    } catch (err) {
      logger.error('[Handler] Failed to bill tuition fee invoice', { error: err.message, enrollmentId });
    }
  },
};
