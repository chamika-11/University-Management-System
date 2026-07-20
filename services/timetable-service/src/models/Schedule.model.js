'use strict';

const mongoose = require('mongoose');

/**
 * A Schedule is a recurring class session tying:
 * - A course section (from academic-service)
 * - A classroom (local)
 * - A time slot (local)
 * - A faculty member (from user-service)
 */
const scheduleSchema = new mongoose.Schema({
  sectionId:   { type: String, required: true, index: true }, // CourseSection._id
  semesterId:  { type: String, required: true, index: true },
  courseId:    { type: String, required: true },
  facultyId:   { type: String, default: null },
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', default: null },
  timeSlotId:  { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
  type:        { type: String, enum: ['LECTURE', 'LAB', 'TUTORIAL', 'EXAM'], default: 'LECTURE' },
  effectiveFrom: { type: Date, required: true },
  effectiveTo:   { type: Date, required: true },
  isActive:    { type: Boolean, default: true },
  color:       { type: String, default: '#4A90D9' }, // for UI calendar display
}, { timestamps: true });

scheduleSchema.index({ sectionId: 1, semesterId: 1, isActive: 1 });
scheduleSchema.index({ classroomId: 1, timeSlotId: 1, isActive: 1 }); // for conflict detection
module.exports = mongoose.model('Schedule', scheduleSchema);
