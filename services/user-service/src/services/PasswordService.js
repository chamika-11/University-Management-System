'use strict';

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const env = require('../config/env');
const userRepo = require('../repositories/user.repository');
const tokenRepo = require('../repositories/token.repository');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class PasswordService {
  async hash(plaintext) {
    return bcrypt.hash(plaintext, env.BCRYPT_SALT_ROUNDS);
  }

  async verify(plaintext, hash) {
    return bcrypt.compare(plaintext, hash);
  }

  validateStrength(password) {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters required');
    if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter required');
    if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter required');
    if (!/\d/.test(password)) errors.push('At least one number required');
    if (!/[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>/?]/.test(password)) errors.push('At least one special character required');
    return errors;
  }

  async initiateReset(email) {
    const user = await userRepo.findByEmail(email);
    // Always return success (don't reveal if email exists)
    if (!user) {
      logger.info('[PasswordService] Reset requested for non-existent email', { email });
      return { message: 'If this email is registered, a reset link has been sent.' };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await tokenRepo.createPasswordResetToken({ rawToken, userId: user._id, expiresAt });

    // In production this would be sent via notification-service Kafka event
    logger.info('[PasswordService] Password reset token generated', { userId: user._id });
    return { resetToken: rawToken, userId: user._id }; // Only for dev
  }

  async resetPassword(rawToken, newPassword) {
    const tokenDoc = await tokenRepo.findPasswordResetToken(rawToken);
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      throw AppError.badRequest('Reset token is invalid or expired', 'INVALID_RESET_TOKEN');
    }

    const passwordErrors = this.validateStrength(newPassword);
    if (passwordErrors.length) {
      throw AppError.badRequest(`Weak password: ${passwordErrors.join('; ')}`, 'WEAK_PASSWORD');
    }

    const passwordHash = await this.hash(newPassword);
    await userRepo.updateById(tokenDoc.userId, { passwordHash });
    await tokenRepo.markPasswordResetTokenUsed(rawToken);
    await tokenRepo.revokeAllUserTokens(tokenDoc.userId);

    logger.info('[PasswordService] Password reset successful', { userId: tokenDoc.userId });
    return { userId: tokenDoc.userId };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepo.findById(userId, true);
    if (!user) throw AppError.notFound('User');

    const isValid = await this.verify(currentPassword, user.passwordHash);
    if (!isValid) throw AppError.unauthorized('Current password is incorrect', 'WRONG_PASSWORD');

    const passwordErrors = this.validateStrength(newPassword);
    if (passwordErrors.length) throw AppError.badRequest(`Weak password: ${passwordErrors.join('; ')}`, 'WEAK_PASSWORD');

    const passwordHash = await this.hash(newPassword);
    await userRepo.updateById(userId, { passwordHash });
    await tokenRepo.revokeAllUserTokens(userId);

    return { message: 'Password changed successfully. All sessions have been terminated.' };
  }
}

module.exports = new PasswordService();
