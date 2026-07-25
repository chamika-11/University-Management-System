'use strict';

const AttendanceSession = require('../models/AttendanceSession.model');
const AttendanceRecord = require('../models/AttendanceRecord.model');
const paginate = require('../utils/paginate');

class AttendanceRepository {
  // Sessions
  async createSession(data) { return AttendanceSession.create(data); }
  async findSessionById(id) { return AttendanceSession.findById(id).populate('scheduleId'); }
  async findSessionsBySection(sectionId, options = {}) { return paginate(AttendanceSession, { sectionId }, { ...options, sort: { sessionDate: -1 } }); }
  async findOpenSessions(sectionId) { return AttendanceSession.find({ sectionId, status: 'OPEN' }); }
  async updateSessionStatus(id, data) { return AttendanceSession.findByIdAndUpdate(id, { $set: data }, { new: true }); }
  async updateSessionCounts(id) {
    const present = await AttendanceRecord.countDocuments({ sessionId: id, status: { $in: ['PRESENT', 'LATE'] } });
    const absent  = await AttendanceRecord.countDocuments({ sessionId: id, status: { $in: ['ABSENT', 'EXCUSED'] } });
    const total   = await AttendanceRecord.countDocuments({ sessionId: id });
    return AttendanceSession.findByIdAndUpdate(id, { $set: { presentCount: present, absentCount: absent, totalStudents: total } }, { new: true });
  }

  // Records
  async createRecord(data) { return AttendanceRecord.create(data); }
  async findRecord(sessionId, studentId) { return AttendanceRecord.findOne({ sessionId, studentId }); }
  async upsertRecord(sessionId, studentId, data) {
    return AttendanceRecord.findOneAndUpdate({ sessionId, studentId }, { $set: { ...data, markedAt: new Date() } }, { upsert: true, new: true });
  }
  async findRecordsBySession(sessionId) { return AttendanceRecord.find({ sessionId }); }
  async findRecordsByStudentSection(studentId, sectionId, semesterId) {
    return AttendanceRecord.find({ studentId, sectionId, semesterId }).sort({ createdAt: 1 });
  }

  // Attendance percentage calculation for a student in a section
  async calculateAttendancePercentage(studentId, sectionId, semesterId) {
    const total = await AttendanceSession.countDocuments({ sectionId, semesterId, status: 'CLOSED' });
    if (!total) return 100;
    const present = await AttendanceRecord.countDocuments({ studentId, sectionId, semesterId, status: { $in: ['PRESENT', 'LATE'] } });
    return Math.round((present / total) * 100);
  }
}

module.exports = new AttendanceRepository();
