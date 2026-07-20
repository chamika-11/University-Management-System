'use strict';

const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    family: {
      type: String,
      required: true, // Token family for rotation detection (reuse = token theft)
      index: true,
    },
    isRevoked: { type: Boolean, default: false },
    deviceInfo: { type: String, default: 'Unknown' },
    ipAddress: { type: String, default: '' },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL — auto-delete after expiry
    },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ userId: 1, isRevoked: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
