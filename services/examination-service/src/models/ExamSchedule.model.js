'use strict';

const mongoose = require('mongoose');

const examScheduleSchema = new mongoose.Schema({
  courseId:    { type: String, required: true, index: true },
  semesterId:  { type: String, required: true, index: true },
  examDate:    { type: Date, required: true },
  startTime:   { type: String, required: true, match: /^\d{2}:\d{2}$/ }, // HH:MM
  endTime:     { type: String, required: true, match: /^\d{2}:\d{2}$/ },
  roomCode:    { type: String, required: true, trim: true },
  invigilatorId: { type: String, default: null }, // facultyId
}, { timestamps: true });

examScheduleSchema.index({ courseId: 1, semesterId: 1 }, { unique: true });
module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
