'use strict';

const libraryRepo = require('../../repositories/library.repository');
const logger = require('../../utils/logger');

/**
 * Consumes finance.payment_completed event to update fine paid status.
 */
module.exports = {
  canHandle: (event) => event.eventType === 'finance.payment_completed' && event.payload.purpose === 'LIBRARY_FINE',

  async handle(event) {
    const { invoiceId } = event.payload;
    logger.info('[Handler] finance.payment_completed received for library fine', { invoiceId });

    try {
      await libraryRepo.updateFinePaid(invoiceId);
    } catch (err) {
      logger.error('[Handler] Failed to update library fine state', { error: err.message, invoiceId });
    }
  },
};
