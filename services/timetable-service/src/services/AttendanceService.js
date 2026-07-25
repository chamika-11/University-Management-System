'use strict';

const attendanceRepo = require('../repositories/attendance.repository');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');
const env = require('../config/env');
const logger = require('../utils/logger');

class AttendanceService {
  /**
   * Opens an attendance session for a scheduled class.
   */
  async openSession(scheduleId, sectionId, semesterId, sessionDate, facultyId) {
    const existing = await attendanceRepo.findOpenSessions(sectionId);
    if (existing.length) throw AppError.conflict('An attendance session is already open for this section', 'SESSION_ALREADY_OPEN');

    const session = await attendanceRepo.createSession({
      scheduleId, sectionId, semesterId,
      sessionDate: new Date(sessionDate),
      status: 'OPEN',
      openedAt: new Date(),
      openedBy: facultyId,
    });

    return session;
  }

  /**
   * Closes an attendance session and computes final counts.
   */
  async closeSession(sessionId, facultyId) {
    const session = await attendanceRepo.findSessionById(sessionId);
    if (!session) throw AppError.notFound('Attendance session');
    if (session.status !== 'OPEN') throw AppError.badRequest('Session is not open', 'SESSION_NOT_OPEN');

    await attendanceRepo.updateSessionStatus(sessionId, { status: 'CLOSED', closedAt: new Date() });
    const updated = await attendanceRepo.updateSessionCounts(sessionId);

    logger.info('[AttendanceService] Session closed', { sessionId, presentCount: updated.presentCount });
    return updated;
  }

  /**
   * Marks attendance for a student in an open session.
   */
  async markAttendance({ sessionId, studentId, sectionId, semesterId, status, markedBy, note = '' }) {
    const session = await attendanceRepo.findSessionById(sessionId);
    if (!session) throw AppError.notFound('Attendance session');
    if (session.status !== 'OPEN') throw AppError.badRequest('Attendance session is not open', 'SESSION_CLOSED');

    const record = await attendanceRepo.upsertRecord(sessionId, studentId, { sectionId, semesterId, status, markedBy, note });

    // After marking, check attendance percentage and alert if below threshold
    await this._checkAttendanceThreshold(studentId, sectionId, semesterId);

    return record;
  }

  /**
   * Bulk-marks attendance for all students in a section (e.g., from a roster).
   */
  async bulkMarkAttendance({ sessionId, sectionId, semesterId, marks, markedBy }) {
    const session = await attendanceRepo.findSessionById(sessionId);
    if (!session) throw AppError.notFound('Attendance session');
    if (session.status !== 'OPEN') throw AppError.badRequest('Session is not open', 'SESSION_CLOSED');

    // marks: [{ studentId, status }]
    const results = await Promise.all(
      marks.map(({ studentId, status }) =>
        attendanceRepo.upsertRecord(sessionId, studentId, { sectionId, semesterId, status, markedBy })
      )
    );

    await attendanceRepo.updateSessionCounts(sessionId);
    return results;
  }

  async getSessionAttendance(sessionId) {
    const session = await attendanceRepo.findSessionById(sessionId);
    if (!session) throw AppError.notFound('Session');
    const records = await attendanceRepo.findRecordsBySession(sessionId);
    return { session, records };
  }

  async getStudentAttendance(studentId, sectionId, semesterId) {
    const records = await attendanceRepo.findRecordsByStudentSection(studentId, sectionId, semesterId);
    const percentage = await attendanceRepo.calculateAttendancePercentage(studentId, sectionId, semesterId);
    const threshold = env.ATTENDANCE_LOW_THRESHOLD;
    return { records, percentage, threshold, isLow: percentage < threshold };
  }

  async getSectionSessions(sectionId, options = {}) {
    return attendanceRepo.findSessionsBySection(sectionId, options);
  }

  /**
   * Sends a low-attendance alert via Kafka if student falls below threshold.
   */
  async _checkAttendanceThreshold(studentId, sectionId, semesterId) {
    const percentage = await attendanceRepo.calculateAttendancePercentage(studentId, sectionId, semesterId);
    if (percentage < env.ATTENDANCE_LOW_THRESHOLD) {
      await publisher.publish('timetable.events', {
        eventType: 'timetable.low_attendance_alert',
        payload: { studentId, sectionId, semesterId, percentage, threshold: env.ATTENDANCE_LOW_THRESHOLD },
      });
      logger.info('[AttendanceService] Low attendance alert published', { studentId, sectionId, percentage });
    }
  }
}

module.exports = new AttendanceService();
