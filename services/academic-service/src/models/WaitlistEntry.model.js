'use strict';

const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  sectionId:   { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSection', required: true, index: true },
  studentId:   { type: String, required: true },
  position:    { type: Number, required: true, min: 1 },
  requestedAt: { type: Date, default: Date.now },
  status:      { type: String, enum: ['WAITING', 'PROMOTED', 'REMOVED'], default: 'WAITING' },
  promotedAt:  { type: Date, default: null },
  notifiedAt:  { type: Date, default: null },
}, { timestamps: true });

waitlistSchema.index({ sectionId: 1, studentId: 1 }, { unique: true });
waitlistSchema.index({ sectionId: 1, status: 1, position: 1 });
module.exports = mongoose.model('WaitlistEntry', waitlistSchema);
