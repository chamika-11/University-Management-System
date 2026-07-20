'use strict';

const userRepo = require('../repositories/user.repository');
const roleRepo = require('../repositories/role.repository');
const tokenService = require('./TokenService');
const passwordService = require('./PasswordService');
const auditService = require('./AuditService');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');
const env = require('../config/env');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Registers a new user, assigns default role, publishes UserRegistered event.
   */
  async register({ email, password, profileType, createdBy = null }) {
    const exists = await userRepo.existsByEmail(email);
    if (exists) throw AppError.conflict('An account with this email already exists', 'EMAIL_TAKEN');

    const passwordErrors = passwordService.validateStrength(password);
    if (passwordErrors.length) throw AppError.badRequest(`Password too weak: ${passwordErrors.join('; ')}`, 'WEAK_PASSWORD');

    const role = await roleRepo.getDefaultRoleForType(profileType);
    if (!role) throw AppError.internal(`No default role configured for profile type: ${profileType}`);

    const passwordHash = await passwordService.hash(password);
    const user = await userRepo.create({ email, passwordHash, roleId: role._id, profileType, createdBy });

    await publisher.publish('user.events', {
      eventType: 'user.registered',
      payload: { userId: user._id.toString(), email: user.email, role: role.name, profileType },
    });

    logger.info('[AuthService] User registered', { userId: user._id, email });
    return { user: { id: user._id, email: user.email, profileType, role: role.name } };
  }

  /**
   * Authenticates user: checks credentials, brute-force, MFA, issues tokens.
   */
  async login({ email, password, mfaToken = null, deviceInfo = 'Unknown', ip = '', userAgent = '' }) {
    const user = await userRepo.findByEmail(email, true);
    const roleDoc = user ? await roleRepo.findById(user.roleId) : null;

    const recordFail = async (reason) => {
      if (user) {
        await userRepo.incrementLoginAttempts(user._id);
        if (user.loginAttempts + 1 >= env.MAX_LOGIN_ATTEMPTS) {
          const lockUntil = new Date(Date.now() + env.LOCK_DURATION_MINUTES * 60 * 1000);
          await userRepo.lockAccount(user._id, lockUntil);
          await publisher.publish('user.events', {
            eventType: 'user.account_locked',
            payload: { userId: user._id.toString(), reason: 'MAX_LOGIN_ATTEMPTS_EXCEEDED' },
          });
        }
      }
      await auditService.record({ userId: user?._id || null, email, ipAddress: ip, userAgent, success: false, failReason: reason });
    };

    if (!user) { await recordFail('USER_NOT_FOUND'); throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS'); }
    if (user.status === 'SUSPENDED' || user.isLocked) { throw AppError.unauthorized('Account is locked. Contact administrator.', 'ACCOUNT_LOCKED'); }
    if (user.status === 'INACTIVE') { throw AppError.unauthorized('Account is inactive', 'ACCOUNT_INACTIVE'); }

    const isValidPassword = await passwordService.verify(password, user.passwordHash);
    if (!isValidPassword) { await recordFail('WRONG_PASSWORD'); throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS'); }

    // MFA check
    if (user.mfaEnabled) {
      if (!mfaToken) throw AppError.unauthorized('MFA token required', 'MFA_REQUIRED');
      const { default: mfaService } = await Promise.resolve({ default: require('./MfaService') });
      const validMfa = await mfaService.verifyTOTP(user._id, mfaToken);
      if (!validMfa) { await recordFail('INVALID_MFA_TOKEN'); throw AppError.unauthorized('Invalid MFA token', 'INVALID_MFA'); }
    }

    await userRepo.resetLoginAttempts(user._id);
    await userRepo.updateLastLogin(user._id);

    const accessToken = tokenService.issueAccessToken(user, roleDoc);
    const refreshToken = await tokenService.issueRefreshToken(user._id, deviceInfo, ip);

    await auditService.record({ userId: user._id, email, ipAddress: ip, userAgent, success: true });
    await publisher.publish('user.events', {
      eventType: 'user.login',
      payload: { userId: user._id.toString(), ip, timestamp: new Date().toISOString() },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user._id, email: user.email, role: roleDoc?.name, profileType: user.profileType },
    };
  }

  /**
   * Rotates refresh token and returns a new access + refresh token pair.
   */
  async refreshTokens({ rawRefreshToken, deviceInfo, ip }) {
    const { rawNewToken, userId } = await tokenService.rotateRefreshToken(rawRefreshToken, deviceInfo, ip);
    const user = await userRepo.findById(userId);
    if (!user) throw AppError.unauthorized('User not found', 'USER_NOT_FOUND');
    const roleDoc = await roleRepo.findById(user.roleId);
    const accessToken = tokenService.issueAccessToken(user, roleDoc);
    return { accessToken, refreshToken: rawNewToken };
  }

  /**
   * Revokes refresh token (logout).
   */
  async logout(rawRefreshToken) {
    if (rawRefreshToken) await tokenService.revokeRefreshToken(rawRefreshToken);
    return { message: 'Logged out successfully' };
  }

  /**
   * Returns the currently authenticated user's full data.
   */
  async getMe(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw AppError.notFound('User');
    return user;
  }
}

module.exports = new AuthService();
