'use strict';

const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true, index: true },
  name:           { type: String, required: true, trim: true }, // e.g. "Semester 1"
  number:         { type: Number, required: true, min: 1 },
  startDate:      { type: Date, required: true },
  endDate:        { type: Date, required: true },
  status:         { type: String, enum: ['UPCOMING', 'ACTIVE', 'COMPLETED', 'ARCHIVED'], default: 'UPCOMING' },
  enrollmentOpenDate:  { type: Date },
  enrollmentCloseDate: { type: Date },
}, { timestamps: true });

semesterSchema.index({ academicYearId: 1, number: 1 }, { unique: true });
semesterSchema.index({ status: 1 });
module.exports = mongoose.model('Semester', semesterSchema);
