'use strict';

const mongoose = require('mongoose');

const mfaConfigSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    secret: {
      type: String,
      required: true,
      select: false,
    },
    method: {
      type: String,
      enum: ['TOTP', 'SMS'],
      default: 'TOTP',
    },
    isEnabled: { type: Boolean, default: false },
    backupCodes: {
      type: [String],
      select: false,
    },
    lastUsedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MfaConfig', mfaConfigSchema);
