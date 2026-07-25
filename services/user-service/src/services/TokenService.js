'use strict';

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');
const tokenRepo = require('../repositories/token.repository');
const AppError = require('../utils/AppError');

class TokenService {
  /**
   * Issues a short-lived JWT access token.
   */
  issueAccessToken(user, roleDoc) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: roleDoc?.name || user.profileType,
      profileType: user.profileType,
      iat: Math.floor(Date.now() / 1000),
    };
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  }

  /**
   * Issues and persists a refresh token.
   */
  async issueRefreshToken(userId, deviceInfo = 'Unknown', ipAddress = '') {
    const rawToken = uuidv4();
    const family = uuidv4(); // New token family per session
    const expiresAt = new Date(Date.now() + this._parseDuration(env.JWT_REFRESH_EXPIRES_IN));

    await tokenRepo.createRefreshToken({ rawToken, userId, family, expiresAt, deviceInfo, ipAddress });
    return rawToken;
  }

  /**
   * Rotates a refresh token: verifies old, revokes it and its family, issues new pair.
   * If a revoked token is reused, revokes the entire family (theft detected).
   */
  async rotateRefreshToken(rawOldToken, deviceInfo, ipAddress) {
    const storedToken = await tokenRepo.findRefreshToken(rawOldToken);

    if (!storedToken) {
      // Token not found or already revoked — possible token reuse (theft)
      // Try to find and revoke the family
      const anyToken = await this._findAnyByRawToken(rawOldToken);
      if (anyToken) {
        await tokenRepo.revokeTokenFamily(anyToken.family);
      }
      throw AppError.unauthorized('Refresh token is invalid or expired. Please log in again.', 'REFRESH_TOKEN_INVALID');
    }

    if (storedToken.expiresAt < new Date()) {
      await tokenRepo.revokeRefreshToken(rawOldToken);
      throw AppError.unauthorized('Refresh token has expired. Please log in again.', 'REFRESH_TOKEN_EXPIRED');
    }

    // Revoke old token
    await tokenRepo.revokeRefreshToken(rawOldToken);

    // Issue new refresh token with SAME family (for rotation chain)
    const rawNewToken = uuidv4();
    const expiresAt = new Date(Date.now() + this._parseDuration(env.JWT_REFRESH_EXPIRES_IN));
    await tokenRepo.createRefreshToken({
      rawToken: rawNewToken,
      userId: storedToken.userId,
      family: storedToken.family,
      expiresAt,
      deviceInfo,
      ipAddress,
    });

    return { rawNewToken, userId: storedToken.userId };
  }

  async revokeRefreshToken(rawToken) {
    return tokenRepo.revokeRefreshToken(rawToken);
  }

  async revokeAllUserTokens(userId) {
    return tokenRepo.revokeAllUserTokens(userId);
  }

  // Helpers
  _parseDuration(str) {
    const unit = str.slice(-1);
    const val = parseInt(str.slice(0, -1), 10);
    if (unit === 'd') return val * 24 * 60 * 60 * 1000;
    if (unit === 'h') return val * 60 * 60 * 1000;
    if (unit === 'm') return val * 60 * 1000;
    return 7 * 24 * 60 * 60 * 1000; // default 7d
  }
}

module.exports = new TokenService();
