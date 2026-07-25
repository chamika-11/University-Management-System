'use strict';

const mongoose = require('mongoose');

const classCancellationSchema = new mongoose.Schema({
  scheduleId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  sessionId:   { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', default: null },
  cancelledDate: { type: Date, required: true },
  reason:      { type: String, enum: ['FACULTY_ABSENT', 'HOLIDAY', 'EMERGENCY', 'MAINTENANCE', 'OTHER'], default: 'OTHER' },
  cancelledBy: { type: String, required: true }, // userId
  note:        { type: String, default: '' },
  makeUpDate:  { type: Date, default: null },
  notified:    { type: Boolean, default: false },
}, { timestamps: true });

classCancellationSchema.index({ scheduleId: 1, cancelledDate: -1 });
module.exports = mongoose.model('ClassCancellation', classCancellationSchema);
