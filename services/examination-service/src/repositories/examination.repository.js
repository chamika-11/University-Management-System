'use strict';

const ExamSchedule = require('../models/ExamSchedule.model');
const HallTicket = require('../models/HallTicket.model');
const paginate = require('../utils/paginate');

class ExaminationRepository {
  async createExamSchedule(data) { return ExamSchedule.create(data); }
  async findExamById(id) { return ExamSchedule.findById(id); }
  async findExams(filter = {}, options = {}) { return paginate(ExamSchedule, filter, options); }

  async createHallTicket(data) { return HallTicket.create(data); }
  async findHallTicketByStudent(studentId, semesterId) { return HallTicket.findOne({ studentId, semesterId }).populate('exams.examScheduleId'); }
  async updateHallTicketApproval(id, isApproved) { return HallTicket.findByIdAndUpdate(id, { $set: { isApproved } }, { new: true }); }
}

module.exports = new ExaminationRepository();
