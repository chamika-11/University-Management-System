'use strict';

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code:         { type: String, required: true, unique: true, uppercase: true, trim: true },
  title:        { type: String, required: true, trim: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
  credits:      { type: Number, required: true, min: 0, max: 20 },
  type:         { type: String, enum: ['CORE', 'ELECTIVE', 'LAB', 'PROJECT', 'SEMINAR'], default: 'CORE' },
  level:        { type: String, enum: ['INTRODUCTORY', 'INTERMEDIATE', 'ADVANCED'], default: 'INTRODUCTORY' },
  description:  { type: String, default: '' },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

courseSchema.virtual('prerequisites', {
  ref: 'Prerequisite',
  localField: '_id',
  foreignField: 'courseId',
});


courseSchema.index({ departmentId: 1, type: 1 });
courseSchema.index({ title: 'text', code: 'text' });

module.exports = mongoose.model('Course', courseSchema);
