'use strict';

const enrollmentRepo = require('../../repositories/enrollment.repository');
const publisher = require('../publisher');
const logger = require('../../utils/logger');

/**
 * Handles finance.payment_completed event for enrollment fee confirmation.
 */
module.exports = {
  canHandle: (event) => event.eventType === 'finance.payment_completed' && event.payload.purpose === 'ENROLLMENT_FEE',
  async handle(event) {
    const { enrollmentId, studentId } = event.payload;
    logger.info('[Handler] finance.payment_completed — confirming enrollment', { enrollmentId });
    try {
      const enrollment = await enrollmentRepo.findById(enrollmentId);
      if (!enrollment || enrollment.status !== 'PENDING') return;
      await enrollmentRepo.updateStatus(enrollmentId, 'CONFIRMED');
      await publisher.publish('academic.events', {
        eventType: 'academic.enrollment_confirmed',
        payload: { enrollmentId, studentId, sectionId: enrollment.sectionId.toString(), semesterId: enrollment.semesterId.toString() },
      });
    } catch (err) { logger.error('[Handler] Failed to confirm enrollment', { error: err.message, enrollmentId }); }
  },
};
