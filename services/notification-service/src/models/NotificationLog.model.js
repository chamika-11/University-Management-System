'use strict';

const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  recipientId:    { type: String, required: true, index: true },
  recipientEmail: { type: String },
  channel:        { type: String, enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'], required: true },
  templateSlug:   { type: String, required: true },
  subject:        { type: String },
  status:         { type: String, enum: ['SENT', 'FAILED', 'PENDING', 'BOUNCED'], default: 'PENDING' },
  sentAt:         { type: Date, default: null },
  failureReason:  { type: String, default: null },
  retryCount:     { type: Number, default: 0 },
  metadata:       { type: mongoose.Schema.Types.Mixed, default: {} }, // event-specific extra data
}, { timestamps: true });

logSchema.index({ recipientId: 1, createdAt: -1 });
logSchema.index({ status: 1, createdAt: -1 });
// Auto-delete logs after 180 days
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });

module.exports = mongoose.model('NotificationLog', logSchema);
