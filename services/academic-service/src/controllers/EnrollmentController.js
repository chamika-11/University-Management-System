'use strict';

const enrollmentService = require('../services/EnrollmentService');
const asyncHandler = require('../utils/asyncHandler');

class EnrollmentController {
  enroll = asyncHandler(async (req, res) => {
    const studentId = req.user.id;
    const { sectionId, semesterId } = req.body;
    const result = await enrollmentService.enroll({ studentId, sectionId, semesterId });
    res.status(201).json({ success: true, data: result });
  });

  getMyEnrollments = asyncHandler(async (req, res) => {
    const { semesterId } = req.query;
    const enrollments = await enrollmentService.getStudentEnrollments(req.user.id, semesterId);
    res.status(200).json({ success: true, data: { enrollments } });
  });

  drop = asyncHandler(async (req, res) => {
    const result = await enrollmentService.drop(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: result });
  });

  getSectionEnrollments = asyncHandler(async (req, res) => {
    const result = await enrollmentService.getSectionEnrollments(req.params.sectionId, req.query);
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  joinWaitlist = asyncHandler(async (req, res) => {
    const result = await enrollmentService.joinWaitlist({ studentId: req.user.id, sectionId: req.body.sectionId });
    res.status(201).json({ success: true, data: result });
  });

  getMyWaitlists = asyncHandler(async (req, res) => {
    const waitlists = await enrollmentService.getStudentWaitlists(req.user.id);
    res.status(200).json({ success: true, data: { waitlists } });
  });

  leaveWaitlist = asyncHandler(async (req, res) => {
    const result = await enrollmentService.leaveWaitlist(req.params.sectionId, req.user.id);
    res.status(200).json({ success: true, data: result });
  });
}

module.exports = new EnrollmentController();
