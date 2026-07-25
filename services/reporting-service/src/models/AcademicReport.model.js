'use strict';

const mongoose = require('mongoose');

const academicReportSchema = new mongoose.Schema({
  reportName:   { type: String, required: true },
  semesterId:   { type: String, required: true, index: true },
  totalStudents:{ type: Number, default: 0 },
  averageCgpa:  { type: Number, default: 0 },
  passPercentage: { type: Number, default: 0 },
  generatedBy:  { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AcademicReport', academicReportSchema);
