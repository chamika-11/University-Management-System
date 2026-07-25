'use strict';

const certService = require('../../services/CertificateService');
const logger = require('../../utils/logger');

/**
 * When academic-service detects a degree completion, document-service automatically issues a DIPLOMA.
 */
module.exports = {
  canHandle: (event) => event.eventType === 'academic.degree_completion_detected',

  async handle(event) {
    const { studentId } = event.payload;
    logger.info('[Handler] academic.degree_completion_detected received — issuing diploma', { studentId });

    try {
      await certService.issueCertificate({ studentId, certificateType: 'DIPLOMA' });
    } catch (err) {
      logger.error('[Handler] Failed to automatically issue diploma', { error: err.message, studentId });
    }
  },
};
