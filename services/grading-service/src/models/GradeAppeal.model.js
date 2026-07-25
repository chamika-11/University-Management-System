'use strict';

const mongoose = require('mongoose');

const gradeAppealSchema = new mongoose.Schema({
  gradeId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true, index: true },
  studentId:   { type: String, required: true },
  reason:      { type: String, required: true, trim: true },
  status:      { type: String, enum: ['SUBMITTED', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'], default: 'SUBMITTED' },
  facultyNotes:{ type: String, default: '' },
  resolvedBy:  { type: String, default: null }, // faculty or admin
  resolvedAt:  { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('GradeAppeal', gradeAppealSchema);
