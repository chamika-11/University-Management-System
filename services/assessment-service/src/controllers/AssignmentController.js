'use strict';

const service = require('../services/AssignmentService');
const repo = require('../repositories/assessment.repository');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

class AssignmentController {
  create = asyncHandler(async (req, res) => {
    const createdBy = req.user.id;
    const assignment = await service.createAssignment({ ...req.body, createdBy });
    res.status(201).json({ success: true, data: { assignment } });
  });

  list = asyncHandler(async (req, res) => {
    const { page, limit, sectionId } = req.query;
    const result = await repo.findAssignmentsBySection(sectionId, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  submit = asyncHandler(async (req, res) => {
    const studentId = req.user.id;
    const { fileUrl } = req.body;
    const submission = await service.submitAssignment({ assignmentId: req.params.id, studentId, fileUrl });
    res.status(201).json({ success: true, data: { submission } });
  });

  grade = asyncHandler(async (req, res) => {
    const gradedBy = req.user.id;
    const { marksObtained, feedback } = req.body;
    const submission = await service.gradeSubmission({ submissionId: req.params.submissionId, marksObtained, feedback, gradedBy });
    res.status(200).json({ success: true, data: { submission } });
  });

  getSubmissions = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await repo.findSubmissionsByAssignment(req.params.id, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });
}

module.exports = new AssignmentController();
