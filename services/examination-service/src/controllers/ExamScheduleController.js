'use strict';

const service = require('../services/ExamSchedulingService');
const repo = require('../repositories/examination.repository');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

class ExamScheduleController {
  schedule = asyncHandler(async (req, res) => {
    const exam = await service.scheduleExam(req.body);
    res.status(201).json({ success: true, data: { exam } });
  });

  list = asyncHandler(async (req, res) => {
    const { page, limit, semesterId } = req.query;
    const filter = semesterId ? { semesterId } : {};
    const result = await repo.findExams(filter, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  generateTicket = asyncHandler(async (req, res) => {
    const { studentId, semesterId, exams } = req.body;
    const ticket = await service.issueHallTicket({ studentId, semesterId, exams });
    res.status(201).json({ success: true, data: { hallTicket: ticket } });
  });

  approveTicket = asyncHandler(async (req, res) => {
    const ticket = await service.approveHallTicket(req.params.id);
    res.status(200).json({ success: true, data: { hallTicket: ticket } });
  });

  getTicket = asyncHandler(async (req, res) => {
    const studentId = req.params.studentId || req.user.id;
    const { semesterId } = req.query;
    const ticket = await repo.findHallTicketByStudent(studentId, semesterId);
    if (!ticket) throw AppError.notFound('Hall ticket not found');
    res.status(200).json({ success: true, data: { hallTicket: ticket } });
  });
}

module.exports = new ExamScheduleController();
