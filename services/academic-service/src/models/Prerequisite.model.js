'use strict';

const mongoose = require('mongoose');

const prerequisiteSchema = new mongoose.Schema({
  courseId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  requiresCourseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  minimumGrade:     { type: String, enum: ['A', 'B', 'C', 'D', 'PASS'], default: 'PASS' },
}, { timestamps: true });

prerequisiteSchema.index({ courseId: 1, requiresCourseId: 1 }, { unique: true });
module.exports = mongoose.model('Prerequisite', prerequisiteSchema);
