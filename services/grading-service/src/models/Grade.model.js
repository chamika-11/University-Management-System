'use strict';

const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId:   { type: String, required: true, index: true },
  sectionId:   { type: String, required: true, index: true },
  semesterId:  { type: String, required: true },
  courseId:    { type: String, required: true },
  marks:       { type: Number, required: true, min: 0, max: 100 },
  letterGrade: { type: String, required: true, uppercase: true, trim: true }, // e.g. "A", "B+", "F"
  gradePoints: { type: Number, required: true, min: 0, max: 10 },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date, default: null },
  gradedBy:    { type: String, required: true }, // facultyId
}, { timestamps: true });

gradeSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
module.exports = mongoose.model('Grade', gradeSchema);
