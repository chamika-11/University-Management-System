'use strict';

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId:      { type: String, default: null, index: true },
  action:      { type: String, required: true }, // e.g., 'user.login', 'academic.enrollment_confirmed'
  timestamp:   { type: Date, default: Date.now },
  ipAddress:   { type: String, default: '' },
  details:     { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

// Auto expire logs after 180 days
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });
module.exports = mongoose.model('AuditLog', auditLogSchema);
