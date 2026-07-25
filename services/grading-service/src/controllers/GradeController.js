'use strict';

const gradeService = require('../services/GradeCalculationService');
const appealService = require('../services/GradeAppealService');
const Grade = require('../models/Grade.model');
const Transcript = require('../models/Transcript.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const paginate = require('../utils/paginate');

class GradeController {
  submit = asyncHandler(async (req, res) => {
    const { studentId, sectionId, semesterId, courseId, marks } = req.body;
    const grade = await gradeService.submitGrade({
      studentId, sectionId, semesterId, courseId, marks,
      gradedBy: req.user.id,
    });
    res.status(201).json({ success: true, data: { grade } });
  });

  publish = asyncHandler(async (req, res) => {
    const result = await gradeService.publishGrades(req.body.semesterId);
    res.status(200).json({ success: true, data: result });
  });

  getTranscript = asyncHandler(async (req, res) => {
    const studentId = req.params.studentId || req.user.id;
    const transcript = await Transcript.findOne({ studentId });
    if (!transcript) throw AppError.notFound('Transcript');
    res.status(200).json({ success: true, data: { transcript } });
  });

  getGrades = asyncHandler(async (req, res) => {
    const { page, limit, studentId, courseId } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (courseId) filter.courseId = courseId;

    // Students only see published, faculty/admin see all
    if (req.user.role === 'STUDENT') {
      filter.studentId = req.user.id;
      filter.isPublished = true;
    }

    const result = await paginate(Grade, filter, { page, limit, sort: { createdAt: -1 } });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  // Appeals
  appeal = asyncHandler(async (req, res) => {
    const appeal = await appealService.submitAppeal({
      gradeId: req.body.gradeId,
      studentId: req.user.id,
      reason: req.body.reason,
    });
    res.status(201).json({ success: true, data: { appeal } });
  });

  resolveAppeal = asyncHandler(async (req, res) => {
    const appeal = await appealService.resolveAppeal({
      appealId: req.params.id,
      status: req.body.status,
      facultyNotes: req.body.facultyNotes,
      resolvedBy: req.user.id,
    });
    res.status(200).json({ success: true, data: { appeal } });
  });

  getAppeals = asyncHandler(async (req, res) => {
    const filter = req.user.role === 'STUDENT' ? { studentId: req.user.id } : {};
    const appeals = await appealService.getAppeals(filter);
    res.status(200).json({ success: true, data: { appeals } });
  });
}

module.exports = new GradeController();
