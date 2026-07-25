'use strict';

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  description:  { type: String, required: true },
  sectionId:    { type: String, required: true, index: true }, // references CourseSection in academic-service
  dueDate:      { type: Date, required: true },
  maxMarks:     { type: Number, required: true, min: 1 },
  createdBy:    { type: String, required: true }, // facultyId
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
