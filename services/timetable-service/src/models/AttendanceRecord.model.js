'use strict';

const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  sessionId:    { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true, index: true },
  studentId:    { type: String, required: true, index: true },
  sectionId:    { type: String, required: true },
  semesterId:   { type: String, required: true },
  status:       { type: String, enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'], default: 'ABSENT' },
  markedAt:     { type: Date, default: null },
  markedBy:     { type: String, default: null }, // facultyId or studentId for self-mark
  note:         { type: String, default: '' },
}, { timestamps: true });

attendanceRecordSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });
attendanceRecordSchema.index({ studentId: 1, sectionId: 1, semesterId: 1 });
module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);
