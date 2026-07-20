'use strict';

const Course = require('../models/Course.model');
const College = require('../models/College.model');
const Department = require('../models/Department.model');
const Program = require('../models/Program.model');
const CourseSyllabus = require('../models/CourseSyllabus.model');
const Prerequisite = require('../models/Prerequisite.model');
const Curriculum = require('../models/Curriculum.model');
const paginate = require('../utils/paginate');
const AppError = require('../utils/AppError');

class CatalogRepository {
  // ── Colleges ────────────────────────────────────────
  async createCollege(data) { return College.create(data); }
  async findColleges(filter = {}) { return College.find(filter).sort({ name: 1 }); }
  async findCollegeById(id) { return College.findById(id); }
  async updateCollege(id, data) { return College.findByIdAndUpdate(id, { $set: data }, { new: true }); }

  // ── Departments ─────────────────────────────────────
  async createDepartment(data) { return Department.create(data); }
  async findDepartments(filter = {}) { return Department.find(filter).populate('collegeId').sort({ name: 1 }); }
  async findDepartmentById(id) { return Department.findById(id).populate('collegeId'); }
  async updateDepartment(id, data) { return Department.findByIdAndUpdate(id, { $set: data }, { new: true }); }

  // ── Programs ────────────────────────────────────────
  async createProgram(data) { return Program.create(data); }
  async findPrograms(filter = {}) { return Program.find(filter).populate('departmentId').sort({ name: 1 }); }
  async findProgramById(id) { return Program.findById(id).populate('departmentId'); }
  async updateProgram(id, data) { return Program.findByIdAndUpdate(id, { $set: data }, { new: true }); }

  // ── Courses ─────────────────────────────────────────
  async createCourse(data) { return Course.create(data); }
  async findCourses(filter = {}, options = {}) { return paginate(Course, filter, { ...options, populate: 'departmentId' }); }
  async findCourseById(id) { return Course.findById(id).populate('departmentId'); }
  async findCourseByCode(code) { return Course.findOne({ code: code.toUpperCase() }); }
  async updateCourse(id, data) { return Course.findByIdAndUpdate(id, { $set: data }, { new: true }); }
  async searchCourses(query) { return Course.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).limit(20); }

  // ── Syllabus ─────────────────────────────────────────
  async upsertSyllabus(courseId, data) {
    const latest = await CourseSyllabus.findOne({ courseId }).sort({ version: -1 });
    const version = latest ? latest.version + 1 : 1;
    return CourseSyllabus.create({ ...data, courseId, version });
  }
  async getLatestSyllabus(courseId) { return CourseSyllabus.findOne({ courseId }).sort({ version: -1 }); }

  // ── Prerequisites ────────────────────────────────────
  async addPrerequisite(data) { return Prerequisite.create(data); }
  async getPrerequisites(courseId) { return Prerequisite.find({ courseId }).populate('requiresCourseId'); }
  async removePrerequisite(id) { return Prerequisite.findByIdAndDelete(id); }

  // ── Curriculum ───────────────────────────────────────
  async createCurriculum(data) { return Curriculum.create(data); }
  async getActiveCurriculum(programId) { return Curriculum.findOne({ programId, isActive: true }).populate('semesterPlan.courses.courseId'); }
  async updateCurriculum(id, data) { return Curriculum.findByIdAndUpdate(id, { $set: data }, { new: true }); }
  async activateCurriculum(id, programId) {
    await Curriculum.updateMany({ programId }, { $set: { isActive: false } });
    return Curriculum.findByIdAndUpdate(id, { $set: { isActive: true } }, { new: true });
  }
}

module.exports = new CatalogRepository();
