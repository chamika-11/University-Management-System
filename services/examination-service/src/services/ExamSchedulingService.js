'use strict';

const repo = require('../repositories/examination.repository');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');

class ExamSchedulingService {
  async scheduleExam(data) {
    try {
      const exam = await repo.createExamSchedule(data);
      await publisher.publish('examination.events', {
        eventType: 'examination.exam_scheduled',
        payload: { examScheduleId: exam._id.toString(), courseId: exam.courseId, examDate: exam.examDate, roomCode: exam.roomCode },
      });
      return exam;
    } catch (err) {
      if (err.code === 11000) throw AppError.conflict('Exam already scheduled for this course and semester', 'EXAM_EXISTS');
      throw err;
    }
  }

  async issueHallTicket({ studentId, semesterId, exams }) {
    const ticketCode = `HT-${uuidv4().slice(0, 8).toUpperCase()}`;

    const ticket = await repo.createHallTicket({
      studentId,
      semesterId,
      ticketCode,
      exams, // [{ examScheduleId, seatNumber }]
      isApproved: false,
    });

    return ticket;
  }

  async approveHallTicket(id) {
    const ticket = await repo.updateHallTicketApproval(id, true);
    if (!ticket) throw AppError.notFound('Hall ticket');

    await publisher.publish('examination.events', {
      eventType: 'examination.hall_ticket_issued',
      payload: { studentId: ticket.studentId, ticketCode: ticket.ticketCode, semesterId: ticket.semesterId },
    });

    return ticket;
  }
}

module.exports = new ExamSchedulingService();
