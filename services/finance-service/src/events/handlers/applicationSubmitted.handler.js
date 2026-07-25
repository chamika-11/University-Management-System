'use strict';

const invoiceService = require('../../services/InvoiceGenerationService');
const logger = require('../../utils/logger');

/**
 * When an admission application is submitted, generate an APPLICATION_FEE invoice.
 */
module.exports = {
  canHandle: (event) => event.eventType === 'admission.application_submitted',

  async handle(event) {
    const { applicationId, applicantId, email } = event.payload;
    logger.info('[Handler] admission.application_submitted received — billing app fee', { applicationId });

    try {
      await invoiceService.createApplicationFeeInvoice({
        applicationId,
        userId: applicantId,
        email,
      });
    } catch (err) {
      logger.error('[Handler] Failed to bill application fee invoice', { error: err.message, applicationId });
    }
  },
};
