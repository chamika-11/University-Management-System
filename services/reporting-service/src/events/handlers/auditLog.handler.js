'use strict';

const reportService = require('../../services/ReportGenerationService');
const logger = require('../../utils/logger');

/**
 * Consumes ALL platform events and registers a persistent audit log history in MongoDB.
 */
module.exports = {
  async handle(event) {
    const { eventType, payload, meta } = event;
    logger.debug('[Handler] Auditing platform event', { eventType });

    try {
      await reportService.recordLog({
        userId: payload.userId || payload.studentId || payload.applicantId || 'SYSTEM',
        action: eventType,
        timestamp: meta?.timestamp || new Date(),
        details: payload,
      });
    } catch (err) {
      logger.error('[Handler] Failed to record audit log entry', { error: err.message });
    }
  },
};
