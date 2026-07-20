'use strict';

const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  courseId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  version:      { type: Number, default: 1 },
  topics:       [{ week: Number, title: String, description: String }],
  learningOutcomes: [{ type: String }],
  textbooks:    [{ title: String, author: String, edition: String, isbn: String }],
  assessmentBreakdown: [{
    type:       { type: String },
    weightPercent: Number,
  }],
  updatedBy:    { type: String, default: null }, // facultyId from user-service
}, { timestamps: true });

syllabusSchema.index({ courseId: 1, version: -1 });
module.exports = mongoose.model('CourseSyllabus', syllabusSchema);
