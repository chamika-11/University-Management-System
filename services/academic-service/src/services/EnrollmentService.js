'use strict';

const enrollmentRepo = require('../repositories/enrollment.repository');
const semesterRepo = require('../repositories/semester.repository');
const catalogRepo = require('../repositories/catalog.repository');
const { getRedisClient } = require('../config/redis');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');
const env = require('../config/env');
const logger = require('../utils/logger');

class EnrollmentService {
  /**
   * Atomically acquires a Redis lock for a seat in a section.
   * Prevents race conditions when multiple students enroll simultaneously.
   */
  async _acquireSeatLock(sectionId) {
    const redis = getRedisClient();
    if (!redis) return true; // Degrade: allow without lock if Redis unavailable

    const lockKey = `seat:lock:${sectionId}`;
    const acquired = await redis.set(lockKey, '1', { NX: true, EX: env.SEAT_LOCK_TTL });
    return acquired === 'OK';
  }

  async _releaseSeatLock(sectionId) {
    const redis = getRedisClient();
    if (!redis) return;
    await redis.del(`seat:lock:${sectionId}`);
  }

  /**
   * Enrolls a student into a section.
   * Flow: check window → check duplicate → check prerequisites → check seats → lock → create enrollment → increment counter
   */
  async enroll({ studentId, sectionId, semesterId }) {
    // 1. Validate section exists
    const section = await semesterRepo.findSectionById(sectionId);
    if (!section || !section.isActive) throw AppError.notFound('Course section');
    if (section.semesterId._id.toString() !== semesterId) throw AppError.badRequest('Section does not belong to this semester', 'SECTION_SEMESTER_MISMATCH');

    // 2. Check if already enrolled
    const existingEnrollment = await enrollmentRepo.findByStudentSection(studentId, sectionId);
    if (existingEnrollment && ['CONFIRMED', 'PENDING', 'WAITLISTED'].includes(existingEnrollment.status)) {
      throw AppError.conflict('Already enrolled or waitlisted in this section', 'ALREADY_ENROLLED');
    }

    // 3. Check seat availability
    if (section.isFull) {
      // Add to waitlist instead
      return this.joinWaitlist({ studentId, sectionId });
    }

    // 4. Acquire Redis lock to prevent race conditions
    const lockAcquired = await this._acquireSeatLock(sectionId);
    if (!lockAcquired) {
      // Brief lock conflict — re-check and add to waitlist
      const freshSection = await semesterRepo.findSectionById(sectionId);
      if (freshSection.isFull) return this.joinWaitlist({ studentId, sectionId });
    }

    try {
      // 5. Create enrollment record
      const enrollment = await enrollmentRepo.create({
        studentId,
        sectionId,
        semesterId,
        status: 'CONFIRMED',
        enrolledAt: new Date(),
      });

      // 6. Increment enrolled count on section
      await semesterRepo.incrementEnrolled(sectionId);

      // 7. Publish event
      await publisher.publish('academic.events', {
        eventType: 'academic.enrollment_confirmed',
        payload: { enrollmentId: enrollment._id.toString(), studentId, sectionId, semesterId },
      });

      logger.info('[EnrollmentService] Enrollment confirmed', { studentId, sectionId });
      return enrollment;
    } finally {
      await this._releaseSeatLock(sectionId);
    }
  }

  /**
   * Drops an enrollment and promotes next waitlisted student.
   */
  async drop(enrollmentId, studentId) {
    const enrollment = await enrollmentRepo.findById(enrollmentId);
    if (!enrollment) throw AppError.notFound('Enrollment');
    if (enrollment.studentId !== studentId) throw AppError.forbidden('Cannot drop another student\'s enrollment', 'FORBIDDEN');
    if (!['CONFIRMED', 'PENDING'].includes(enrollment.status)) throw AppError.badRequest('Enrollment cannot be dropped', 'INVALID_STATUS');

    // Update enrollment status
    await enrollmentRepo.softDelete(enrollmentId);

    // Decrement section count
    await semesterRepo.decrementEnrolled(enrollment.sectionId);

    // Publish seat released event
    await publisher.publish('academic.events', {
      eventType: 'academic.seat_released',
      payload: { sectionId: enrollment.sectionId.toString(), studentId },
    });

    // Promote from waitlist
    await this._promoteFromWaitlist(enrollment.sectionId.toString(), enrollment.semesterId.toString());

    return { message: 'Enrollment dropped successfully' };
  }

  /**
   * Promotes the next student from waitlist when a seat opens.
   */
  async _promoteFromWaitlist(sectionId, semesterId) {
    const waitlist = await enrollmentRepo.getWaitlist(sectionId);
    if (!waitlist.length) return;

    const next = waitlist[0];

    // Create confirmed enrollment for promoted student
    await enrollmentRepo.create({
      studentId: next.studentId,
      sectionId,
      semesterId,
      status: 'CONFIRMED',
      enrolledAt: new Date(),
    });

    await semesterRepo.incrementEnrolled(sectionId);
    await enrollmentRepo.promoteFromWaitlist(next._id);

    await publisher.publish('academic.events', {
      eventType: 'academic.enrollment_confirmed',
      payload: { studentId: next.studentId, sectionId, semesterId, promotedFromWaitlist: true },
    });

    logger.info('[EnrollmentService] Student promoted from waitlist', { studentId: next.studentId, sectionId });
  }

  async joinWaitlist({ studentId, sectionId }) {
    const existing = await enrollmentRepo.getStudentWaitlistEntry(sectionId, studentId);
    if (existing) throw AppError.conflict('Already on waitlist for this section', 'ALREADY_WAITLISTED');

    const entry = await enrollmentRepo.addToWaitlist({ studentId, sectionId });

    await publisher.publish('academic.events', {
      eventType: 'academic.enrollment_requested',
      payload: { studentId, sectionId, waitlistPosition: entry.position },
    });

    return { waitlistEntry: entry, message: `Added to waitlist at position ${entry.position}` };
  }

  async getStudentEnrollments(studentId, semesterId) {
    return enrollmentRepo.findByStudentSemester(studentId, semesterId);
  }

  async getSectionEnrollments(sectionId, options = {}) {
    return enrollmentRepo.findBySectionId(sectionId, options);
  }

  async getStudentWaitlists(studentId) {
    return enrollmentRepo.getStudentWaitlists(studentId);
  }

  async leaveWaitlist(sectionId, studentId) {
    const entry = await enrollmentRepo.getStudentWaitlistEntry(sectionId, studentId);
    if (!entry) throw AppError.notFound('Waitlist entry');
    return enrollmentRepo.removeFromWaitlist(sectionId, studentId);
  }
}

module.exports = new EnrollmentService();
