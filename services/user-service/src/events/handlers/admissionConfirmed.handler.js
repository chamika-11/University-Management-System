'use strict';

const userRepo = require('../../repositories/user.repository');
const profileRepo = require('../../repositories/profile.repository');
const roleRepo = require('../../repositories/role.repository');
const passwordService = require('../../services/PasswordService');
const publisher = require('../publisher');
const logger = require('../../utils/logger');
const crypto = require('crypto');

/**
 * Handles admission.confirmed event:
 * - Creates a User account for the admitted applicant
 * - Creates a StudentProfile linked to the user
 * - Emits user.registered and user.profile_created events
 */
const handler = {
  canHandle(event) {
    return event.eventType === 'admission.confirmed';
  },

  async handle(event) {
    const { applicantId, email, firstName, lastName, programId } = event.payload;
    logger.info('[Handler] Processing admission.confirmed', { applicantId, email });

    try {
      // Check if user already exists (idempotent)
      const existing = await userRepo.existsByEmail(email);
      if (existing) {
        logger.warn('[Handler] User already exists for admitted applicant', { email });
        return;
      }

      // Generate a temporary password (student must change on first login)
      const tempPassword = crypto.randomBytes(8).toString('hex');
      const passwordHash = await passwordService.hash(tempPassword);

      const role = await roleRepo.getDefaultRoleForType('STUDENT');
      const user = await userRepo.create({
        email,
        passwordHash,
        roleId: role._id,
        profileType: 'STUDENT',
      });

      // Create student profile
      await profileRepo.create('STUDENT', {
        userId: user._id,
        firstName,
        lastName,
        programId: programId || null,
        enrollmentStatus: 'ENROLLED',
        enrollmentYear: new Date().getFullYear(),
      });

      // Notify notification-service to send welcome email with temp password
      await publisher.publish('user.events', {
        eventType: 'user.registered',
        payload: {
          userId: user._id.toString(),
          email,
          role: 'STUDENT',
          profileType: 'STUDENT',
          tempPassword, // notification-service will use this in the welcome email
          firstName,
        },
      });

      logger.info('[Handler] Student user created from admission', { userId: user._id, email });
    } catch (err) {
      logger.error('[Handler] Failed to create student from admission', { error: err.message, email });
    }
  },
};

module.exports = handler;
