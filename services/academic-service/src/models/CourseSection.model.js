'use strict';

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const courseSectionSchema = new mongoose.Schema({
  courseId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  semesterId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true, index: true },
  facultyId:    { type: String, default: null }, // userId from user-service
  sectionCode:  { type: String, required: true, uppercase: true, trim: true, default: () => uuidv4().slice(0, 4).toUpperCase() },
  capacity:     { type: Number, required: true, min: 1, max: 500 },
  enrolled:     { type: Number, default: 0, min: 0 },
  waitlisted:   { type: Number, default: 0, min: 0 },
  room:         { type: String, trim: true, default: 'TBD' },
  schedule:     { type: String, trim: true, default: '' }, // human-readable e.g. "Mon/Wed 09:00-10:30"
  deliveryMode: { type: String, enum: ['IN_PERSON', 'ONLINE', 'HYBRID'], default: 'IN_PERSON' },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

courseSectionSchema.virtual('availableSeats').get(function () { return Math.max(0, this.capacity - this.enrolled); });
courseSectionSchema.virtual('isFull').get(function () { return this.enrolled >= this.capacity; });

courseSectionSchema.index({ courseId: 1, semesterId: 1, sectionCode: 1 }, { unique: true });
module.exports = mongoose.model('CourseSection', courseSectionSchema);
