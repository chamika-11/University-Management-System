'use strict';

const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema({
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
  version:   { type: String, default: '1.0' },
  isActive:  { type: Boolean, default: false },
  totalCredits: { type: Number, default: 0 },
  semesterPlan: [{
    semesterNumber: { type: Number, required: true },
    courses: [{ courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, isOptional: { type: Boolean, default: false } }],
    minCredits: Number,
  }],
  approvedBy: { type: String, default: null },
  effectiveFrom: { type: Date },
}, { timestamps: true });

curriculumSchema.index({ programId: 1, isActive: 1 });
module.exports = mongoose.model('Curriculum', curriculumSchema);
