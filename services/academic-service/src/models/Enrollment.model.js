'use strict';

const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId:  { type: String, required: true, index: true }, // userId from user-service
  sectionId:  { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSection', required: true, index: true },
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true, index: true },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'WAITLISTED', 'DROPPED', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  },
  enrolledAt:  { type: Date, default: Date.now },
  droppedAt:   { type: Date, default: null },
  completedAt: { type: Date, default: null },
  grade:       { type: String, default: null }, // assigned by grading-service
  gradedAt:    { type: Date, default: null },
}, { timestamps: true });

enrollmentSchema.index({ studentId: 1, sectionId: 1 }, { unique: true });
enrollmentSchema.index({ studentId: 1, semesterId: 1, status: 1 });
enrollmentSchema.index({ sectionId: 1, status: 1 });
module.exports = mongoose.model('Enrollment', enrollmentSchema);
