'use strict';

const appService = require('../../services/ApplicationProcessingService');
const logger = require('../../utils/logger');

/**
 * Consumes payment completed event. If it is for an APPLICATION_FEE, marks the application as paid.
 */
module.exports = {
  canHandle: (event) => event.eventType === 'finance.payment_completed' && event.payload.purpose === 'APPLICATION_FEE',

  async handle(event) {
    const { referenceId, invoiceId } = event.payload;
    logger.info('[Handler] finance.payment_completed received for application fee', { referenceId, invoiceId });

    try {
      await appService.markPaid(referenceId, invoiceId);
    } catch (err) {
      logger.error('[Handler] Failed to confirm application payment', { error: err.message, referenceId });
    }
  },
};
