'use strict';

const catalogService = require('../services/CatalogService');
const asyncHandler = require('../utils/asyncHandler');

class CatalogController {
  // Colleges
  createCollege   = asyncHandler(async (req, res) => { const c = await catalogService.createCollege(req.body); res.status(201).json({ success: true, data: { college: c } }); });
  getColleges     = asyncHandler(async (req, res) => { const colleges = await catalogService.getColleges(); res.status(200).json({ success: true, data: { colleges } }); });
  getCollege      = asyncHandler(async (req, res) => { const c = await catalogService.getCollege(req.params.id); res.status(200).json({ success: true, data: { college: c } }); });
  updateCollege   = asyncHandler(async (req, res) => { const c = await catalogService.updateCollege(req.params.id, req.body); res.status(200).json({ success: true, data: { college: c } }); });

  // Departments
  createDepartment = asyncHandler(async (req, res) => { const d = await catalogService.createDepartment(req.body); res.status(201).json({ success: true, data: { department: d } }); });
  getDepartments   = asyncHandler(async (req, res) => { const departments = await catalogService.getDepartments(req.query.collegeId ? { collegeId: req.query.collegeId } : {}); res.status(200).json({ success: true, data: { departments } }); });
  getDepartment    = asyncHandler(async (req, res) => { const d = await catalogService.getDepartment(req.params.id); res.status(200).json({ success: true, data: { department: d } }); });
  updateDepartment = asyncHandler(async (req, res) => { const d = await catalogService.updateDepartment(req.params.id, req.body); res.status(200).json({ success: true, data: { department: d } }); });

  // Programs
  createProgram = asyncHandler(async (req, res) => { const p = await catalogService.createProgram(req.body); res.status(201).json({ success: true, data: { program: p } }); });
  getPrograms   = asyncHandler(async (req, res) => { const programs = await catalogService.getPrograms(req.query.departmentId ? { departmentId: req.query.departmentId } : {}); res.status(200).json({ success: true, data: { programs } }); });
  getProgram    = asyncHandler(async (req, res) => { const p = await catalogService.getProgram(req.params.id); res.status(200).json({ success: true, data: { program: p } }); });

  // Courses
  createCourse  = asyncHandler(async (req, res) => { const c = await catalogService.createCourse(req.body); res.status(201).json({ success: true, data: { course: c } }); });
  getCourses    = asyncHandler(async (req, res) => {
    const { page, limit, departmentId, type, search } = req.query;
    if (search) { const results = await catalogService.searchCourses(search); return res.status(200).json({ success: true, data: { courses: results } }); }
    const filter = {};
    if (departmentId) filter.departmentId = departmentId;
    if (type) filter.type = type;
    const result = await catalogService.getCourses(filter, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });
  getCourse     = asyncHandler(async (req, res) => { const c = await catalogService.getCourse(req.params.id); res.status(200).json({ success: true, data: { course: c } }); });
  updateCourse  = asyncHandler(async (req, res) => { const c = await catalogService.updateCourse(req.params.id, req.body); res.status(200).json({ success: true, data: { course: c } }); });

  // Syllabus
  getSyllabus   = asyncHandler(async (req, res) => { const s = await catalogService.getLatestSyllabus(req.params.id); res.status(200).json({ success: true, data: { syllabus: s } }); });
  upsertSyllabus = asyncHandler(async (req, res) => { const s = await catalogService.upsertSyllabus(req.params.id, { ...req.body, updatedBy: req.user.id }); res.status(200).json({ success: true, data: { syllabus: s } }); });

  // Prerequisites
  addPrerequisite    = asyncHandler(async (req, res) => { const p = await catalogService.addPrerequisite(req.params.id, req.body.requiresCourseId, req.body.minimumGrade); res.status(201).json({ success: true, data: { prerequisite: p } }); });
  getPrerequisites   = asyncHandler(async (req, res) => { const prereqs = await catalogService.getPrerequisites(req.params.id); res.status(200).json({ success: true, data: { prerequisites: prereqs } }); });
}

module.exports = new CatalogController();
