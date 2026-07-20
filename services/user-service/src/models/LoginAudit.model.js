'use strict';

const mongoose = require('mongoose');

const loginAuditSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    email: { type: String, lowercase: true },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    success: { type: Boolean, required: true },
    failReason: { type: String, default: null },
    mfaUsed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // Auto-delete audit logs after 90 days
  }
);

loginAuditSchema.index({ userId: 1, createdAt: -1 });
loginAuditSchema.index({ email: 1, createdAt: -1 });
loginAuditSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('LoginAudit', loginAuditSchema);
