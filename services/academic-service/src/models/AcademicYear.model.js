'use strict';

const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  year:      { type: String, required: true, unique: true, trim: true }, // e.g. "2024/2025"
  startDate: { type: Date, required: true },
  endDate:   { type: Date, required: true },
  isActive:  { type: Boolean, default: false },
  createdBy: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('AcademicYear', academicYearSchema);
