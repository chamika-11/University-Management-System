'use strict';

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const MfaConfig = require('../models/MfaConfig.model');
const userRepo = require('../repositories/user.repository');
const AppError = require('../utils/AppError');
const env = require('../config/env');

class MfaService {
  /**
   * Generates a TOTP secret and returns the QR code data URL for setup.
   * Does NOT enable MFA until verifyAndEnable is called.
   */
  async setupTOTP(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw AppError.notFound('User');

    const secret = speakeasy.generateSecret({
      issuer: env.MFA_ISSUER,
      label: user.email,
      length: 20,
    });

    // Upsert config (pending, not enabled yet)
    await MfaConfig.findOneAndUpdate(
      { userId },
      { secret: secret.base32, method: 'TOTP', isEnabled: false },
      { upsert: true, new: true }
    );

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    return { secret: secret.base32, qrCode: qrCodeUrl };
  }

  /**
   * Verifies TOTP token against stored secret.
   */
  async verifyTOTP(userId, token) {
    const config = await MfaConfig.findOne({ userId }).select('+secret');
    if (!config || !config.secret) throw AppError.badRequest('MFA not configured', 'MFA_NOT_CONFIGURED');

    const isValid = speakeasy.totp.verify({
      secret: config.secret,
      encoding: 'base32',
      token: token,
      window: 1, // Allow 30s clock drift
    });

    if (isValid) {
      await MfaConfig.findOneAndUpdate({ userId }, { lastUsedAt: new Date() });
    }

    return isValid;
  }

  /**
   * Enables MFA after verifying the first TOTP token.
   */
  async enableMfa(userId, token) {
    const isValid = await this.verifyTOTP(userId, token);
    if (!isValid) throw AppError.badRequest('Invalid TOTP token', 'INVALID_TOTP');

    const backupCodes = await this._generateBackupCodes();
    await MfaConfig.findOneAndUpdate({ userId }, { isEnabled: true, backupCodes: backupCodes.hashed });
    await userRepo.updateById(userId, { mfaEnabled: true });

    return { message: 'MFA enabled successfully', backupCodes: backupCodes.plain };
  }

  /**
   * Disables MFA after verifying current TOTP token.
   */
  async disableMfa(userId, token) {
    const isValid = await this.verifyTOTP(userId, token);
    if (!isValid) throw AppError.badRequest('Invalid TOTP token', 'INVALID_TOTP');

    await MfaConfig.findOneAndUpdate({ userId }, { isEnabled: false, secret: '', backupCodes: [] });
    await userRepo.updateById(userId, { mfaEnabled: false });

    return { message: 'MFA disabled successfully' };
  }

  /**
   * Verifies and consumes a backup code.
   */
  async verifyBackupCode(userId, code) {
    const config = await MfaConfig.findOne({ userId }).select('+backupCodes');
    if (!config || !config.backupCodes?.length) throw AppError.badRequest('No backup codes available', 'NO_BACKUP_CODES');

    for (let i = 0; i < config.backupCodes.length; i++) {
      const match = await bcrypt.compare(code, config.backupCodes[i]);
      if (match) {
        // Remove used code
        config.backupCodes.splice(i, 1);
        await config.save();
        return true;
      }
    }
    return false;
  }

  async _generateBackupCodes(count = 10) {
    const plain = Array.from({ length: count }, () => crypto.randomBytes(4).toString('hex').toUpperCase());
    const hashed = await Promise.all(plain.map((c) => bcrypt.hash(c, 10)));
    return { plain, hashed };
  }
}

module.exports = new MfaService();
