'use strict';

const attendanceService = require('../services/AttendanceService');
const asyncHandler = require('../utils/asyncHandler');

class AttendanceController {
  openSession = asyncHandler(async (req, res) => {
    const { scheduleId, sectionId, semesterId, sessionDate } = req.body;
    const session = await attendanceService.openSession(scheduleId, sectionId, semesterId, sessionDate, req.user.id);
    res.status(201).json({ success: true, data: { session } });
  });

  closeSession = asyncHandler(async (req, res) => {
    const session = await attendanceService.closeSession(req.params.sessionId, req.user.id);
    res.status(200).json({ success: true, data: { session } });
  });

  markAttendance = asyncHandler(async (req, res) => {
    const { studentId, sectionId, semesterId, status, note } = req.body;
    const record = await attendanceService.markAttendance({ sessionId: req.params.sessionId, studentId, sectionId, semesterId, status, markedBy: req.user.id, note });
    res.status(200).json({ success: true, data: { record } });
  });

  bulkMarkAttendance = asyncHandler(async (req, res) => {
    const { sectionId, semesterId, marks } = req.body;
    const records = await attendanceService.bulkMarkAttendance({ sessionId: req.params.sessionId, sectionId, semesterId, marks, markedBy: req.user.id });
    res.status(200).json({ success: true, data: { records } });
  });

  getSessionAttendance = asyncHandler(async (req, res) => {
    const data = await attendanceService.getSessionAttendance(req.params.sessionId);
    res.status(200).json({ success: true, data });
  });

  getMyAttendance = asyncHandler(async (req, res) => {
    const { sectionId, semesterId } = req.query;
    const data = await attendanceService.getStudentAttendance(req.user.id, sectionId, semesterId);
    res.status(200).json({ success: true, data });
  });

  getStudentAttendance = asyncHandler(async (req, res) => {
    const { sectionId, semesterId } = req.query;
    const data = await attendanceService.getStudentAttendance(req.params.studentId, sectionId, semesterId);
    res.status(200).json({ success: true, data });
  });

  getSectionSessions = asyncHandler(async (req, res) => {
    const result = await attendanceService.getSectionSessions(req.params.sectionId, req.query);
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });
}

module.exports = new AttendanceController();
