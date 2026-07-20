'use strict';

const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
  date:        { type: Date, required: true, unique: true },
  name:        { type: String, required: true, trim: true },
  type:        { type: String, enum: ['PUBLIC', 'UNIVERSITY', 'EXAM_PERIOD', 'SEMESTER_BREAK'], default: 'PUBLIC' },
  description: { type: String, default: '' },
  academicYearId: { type: String, default: null },
  isRecurring: { type: Boolean, default: false }, // Repeat every year
}, { timestamps: true });

holidaySchema.index({ date: 1 });
module.exports = mongoose.model('HolidayCalendar', holidaySchema);
