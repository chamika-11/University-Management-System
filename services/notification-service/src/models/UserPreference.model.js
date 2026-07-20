'use strict';

const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  channels: {
    email: { type: Boolean, default: true },
    sms:   { type: Boolean, default: false },
    push:  { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
  },
  mutedTopics: [{ type: String }], // event types the user doesn't want notifications for
  quietHours: {
    enabled:   { type: Boolean, default: false },
    startHour: { type: Number, min: 0, max: 23, default: 22 },
    endHour:   { type: Number, min: 0, max: 23, default: 8 },
  },
}, { timestamps: true });

preferenceSchema.index({ userId: 1 }, { unique: true });
module.exports = mongoose.model('UserPreference', preferenceSchema);
