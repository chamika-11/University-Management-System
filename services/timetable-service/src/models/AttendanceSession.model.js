'use strict';

const mongoose = require('mongoose');

/**
 * An AttendanceSession is created for each scheduled class meeting.
 * Faculty opens it to allow students to mark attendance.
 */
const attendanceSessionSchema = new mongoose.Schema({
  scheduleId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true, index: true },
  sectionId:    { type: String, required: true, index: true },
  semesterId:   { type: String, required: true },
  sessionDate:  { type: Date, required: true },
  openedAt:     { type: Date, default: null },
  closedAt:     { type: Date, default: null },
  status:       { type: String, enum: ['PENDING', 'OPEN', 'CLOSED', 'CANCELLED'], default: 'PENDING' },
  openedBy:     { type: String, default: null }, // facultyId
  totalStudents:{ type: Number, default: 0 },
  presentCount: { type: Number, default: 0 },
  absentCount:  { type: Number, default: 0 },
  cancelReason: { type: String, default: null },
}, { timestamps: true });

attendanceSessionSchema.index({ sectionId: 1, sessionDate: -1 });
attendanceSessionSchema.index({ status: 1 });
module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
