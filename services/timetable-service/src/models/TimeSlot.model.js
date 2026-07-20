'use strict';

const mongoose = require('mongoose');

/**
 * A TimeSlot is a reusable recurring time block (e.g. Mon 09:00–10:30).
 * Multiple schedules can reference the same time slot.
 */
const timeSlotSchema = new mongoose.Schema({
  dayOfWeek:  { type: Number, required: true, min: 0, max: 6 }, // 0=Sunday, 1=Monday, ...
  startTime:  { type: String, required: true, match: /^\d{2}:\d{2}$/ }, // HH:MM
  endTime:    { type: String, required: true, match: /^\d{2}:\d{2}$/ },
  durationMin:{ type: Number, required: true, min: 15 },
}, { timestamps: true });

timeSlotSchema.index({ dayOfWeek: 1, startTime: 1 });
module.exports = mongoose.model('TimeSlot', timeSlotSchema);
