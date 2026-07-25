'use strict';

const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken.model');
const PasswordResetToken = require('../models/PasswordResetToken.model');

class TokenRepository {
  _hash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Refresh Tokens
  async createRefreshToken({ rawToken, userId, family, expiresAt, deviceInfo, ipAddress }) {
    return RefreshToken.create({
      tokenHash: this._hash(rawToken),
      userId,
      family,
      expiresAt,
      deviceInfo,
      ipAddress,
    });
  }

  async findRefreshToken(rawToken) {
    return RefreshToken.findOne({ tokenHash: this._hash(rawToken), isRevoked: false });
  }

  async revokeRefreshToken(rawToken) {
    return RefreshToken.findOneAndUpdate({ tokenHash: this._hash(rawToken) }, { $set: { isRevoked: true } });
  }

  async revokeTokenFamily(family) {
    return RefreshToken.updateMany({ family }, { $set: { isRevoked: true } });
  }

  async revokeAllUserTokens(userId) {
    return RefreshToken.updateMany({ userId }, { $set: { isRevoked: true } });
  }

  // Password Reset Tokens
  async createPasswordResetToken({ rawToken, userId, expiresAt }) {
    // Invalidate any existing tokens for this user
    await PasswordResetToken.updateMany({ userId, isUsed: false }, { $set: { isUsed: true } });
    return PasswordResetToken.create({ tokenHash: this._hash(rawToken), userId, expiresAt });
  }

  async findPasswordResetToken(rawToken) {
    return PasswordResetToken.findOne({ tokenHash: this._hash(rawToken), isUsed: false });
  }

  async markPasswordResetTokenUsed(rawToken) {
    return PasswordResetToken.findOneAndUpdate({ tokenHash: this._hash(rawToken) }, { $set: { isUsed: true } });
  }
}

module.exports = new TokenRepository();
