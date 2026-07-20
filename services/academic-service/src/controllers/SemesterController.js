'use strict';

const semesterService = require('../services/SemesterService');
const asyncHandler = require('../utils/asyncHandler');

class SemesterController {
  createYear      = asyncHandler(async (req, res) => { const y = await semesterService.createAcademicYear(req.body); res.status(201).json({ success: true, data: { academicYear: y } }); });
  getYears        = asyncHandler(async (req, res) => { const years = await semesterService.getAcademicYears(); res.status(200).json({ success: true, data: { academicYears: years } }); });
  createSemester  = asyncHandler(async (req, res) => { const s = await semesterService.createSemester(req.body); res.status(201).json({ success: true, data: { semester: s } }); });
  getSemesters    = asyncHandler(async (req, res) => { const semesters = await semesterService.getSemesters(); res.status(200).json({ success: true, data: { semesters } }); });
  getCurrent      = asyncHandler(async (req, res) => { const s = await semesterService.getCurrentSemester(); res.status(200).json({ success: true, data: { semester: s } }); });
  getSemester     = asyncHandler(async (req, res) => { const s = await semesterService.getSemester(req.params.id); res.status(200).json({ success: true, data: { semester: s } }); });
  createSection   = asyncHandler(async (req, res) => { const s = await semesterService.createSection(req.body); res.status(201).json({ success: true, data: { section: s } }); });
  getSections     = asyncHandler(async (req, res) => { const sections = await semesterService.getSections(req.query.semesterId ? { semesterId: req.query.semesterId } : {}); res.status(200).json({ success: true, data: { sections } }); });
  getSemesterSections = asyncHandler(async (req, res) => { const sections = await semesterService.getSections({ semesterId: req.params.id }); res.status(200).json({ success: true, data: { sections } }); });
  updateSection   = asyncHandler(async (req, res) => { const s = await semesterService.updateSection(req.params.sectionId, req.body); res.status(200).json({ success: true, data: { section: s } }); });
}

module.exports = new SemesterController();
