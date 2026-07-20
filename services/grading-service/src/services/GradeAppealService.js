'use strict';

const GradeAppeal = require('../models/GradeAppeal.model');
const Grade = require('../models/Grade.model');
const gradeService = require('./GradeCalculationService');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class GradeAppealService {
  async submitAppeal({ gradeId, studentId, reason }) {
    const grade = await Grade.findById(gradeId);
    if (!grade) throw AppError.notFound('Grade');
    if (grade.studentId !== studentId) throw AppError.forbidden('You cannot appeal this grade', 'FORBIDDEN');

    const appeal = await GradeAppeal.create({
      gradeId,
      studentId,
      reason,
      status: 'SUBMITTED',
    });

    logger.info('[GradingService] Appeal submitted', { gradeId, appealId: appeal._id });
    return appeal;
  }

  async resolveAppeal({ appealId, status, facultyNotes, resolvedBy }) {
    const appeal = await GradeAppeal.findById(appealId);
    if (!appeal) throw AppError.notFound('Grade appeal');
    if (appeal.status !== 'SUBMITTED' && appeal.status !== 'UNDER_REVIEW') {
      throw AppError.badRequest('Appeal has already been resolved', 'ALREADY_RESOLVED');
    }

    appeal.status = status;
    appeal.facultyNotes = facultyNotes;
    appeal.resolvedBy = resolvedBy;
    appeal.resolvedAt = new Date();
    await appeal.save();

    logger.info('[GradingService] Grade appeal resolved', { appealId, status });
    return appeal;
  }

  async getAppeals(filter = {}) {
    return GradeAppeal.find(filter).populate('gradeId');
  }
}

module.exports = new GradeAppealService();
