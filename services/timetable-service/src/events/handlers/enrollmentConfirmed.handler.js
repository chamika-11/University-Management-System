'use strict';

const attendanceRepo = require('../../repositories/attendance.repository');
const scheduleRepo = require('../../repositories/schedule.repository');
const logger = require('../../utils/logger');

/**
 * When a student confirms enrollment in a section, pre-create attendance session records
 * for all future scheduled sessions of that section (if applicable).
 * This handler mainly serves as a cross-service integration point.
 */
module.exports = {
  canHandle: (event) => event.eventType === 'academic.enrollment_confirmed',

  async handle(event) {
    const { sectionId, studentId, semesterId } = event.payload;
    logger.info('[Handler] academic.enrollment_confirmed received', { studentId, sectionId });

    // This is an integration point — can pre-populate attendance roster entries
    // For now, we log and let attendance be created on first session opening
    // In a full implementation, this would seed AttendanceRecord stubs for all sessions
    try {
      const schedules = await scheduleRepo.findBySectionId(sectionId);
      logger.info('[Handler] Timetable ready for enrolled student', { studentId, sectionId, scheduleCount: schedules.length });
    } catch (err) {
      logger.error('[Handler] Failed to process enrollment confirmation', { error: err.message, studentId, sectionId });
    }
  },
};
