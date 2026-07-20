'use strict';

const catalogRepo = require('../repositories/catalog.repository');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');
const pick = require('../utils/pick');

class CatalogService {
  // ── Colleges ────────────────────────────────────────────────────────────
  async createCollege(data) {
    try { return await catalogRepo.createCollege(data); }
    catch (err) { if (err.code === 11000) throw AppError.conflict('College code already exists', 'COLLEGE_CODE_TAKEN'); throw err; }
  }
  async getColleges(filter = {}) { return catalogRepo.findColleges(filter); }
  async getCollege(id) { const c = await catalogRepo.findCollegeById(id); if (!c) throw AppError.notFound('College'); return c; }
  async updateCollege(id, data) {
    const c = await catalogRepo.updateCollege(id, pick(data, ['name', 'dean', 'description', 'established', 'isActive']));
    if (!c) throw AppError.notFound('College');
    return c;
  }

  // ── Departments ──────────────────────────────────────────────────────────
  async createDepartment(data) {
    try { return await catalogRepo.createDepartment(data); }
    catch (err) { if (err.code === 11000) throw AppError.conflict('Department code already exists', 'DEPT_CODE_TAKEN'); throw err; }
  }
  async getDepartments(filter = {}) { return catalogRepo.findDepartments(filter); }
  async getDepartment(id) { const d = await catalogRepo.findDepartmentById(id); if (!d) throw AppError.notFound('Department'); return d; }
  async updateDepartment(id, data) {
    const d = await catalogRepo.updateDepartment(id, pick(data, ['name', 'hodId', 'description', 'isActive']));
    if (!d) throw AppError.notFound('Department');
    return d;
  }

  // ── Programs ─────────────────────────────────────────────────────────────
  async createProgram(data) {
    try { return await catalogRepo.createProgram(data); }
    catch (err) { if (err.code === 11000) throw AppError.conflict('Program code already exists', 'PROGRAM_CODE_TAKEN'); throw err; }
  }
  async getPrograms(filter = {}) { return catalogRepo.findPrograms(filter); }
  async getProgram(id) { const p = await catalogRepo.findProgramById(id); if (!p) throw AppError.notFound('Program'); return p; }
  async updateProgram(id, data) { const p = await catalogRepo.updateProgram(id, data); if (!p) throw AppError.notFound('Program'); return p; }

  // ── Courses ──────────────────────────────────────────────────────────────
  async createCourse(data) {
    try {
      const course = await catalogRepo.createCourse(data);
      await publisher.publish('academic.events', {
        eventType: 'academic.course_created',
        payload: { courseId: course._id.toString(), code: course.code, title: course.title, credits: course.credits, departmentId: course.departmentId?.toString() },
      });
      return course;
    } catch (err) { if (err.code === 11000) throw AppError.conflict('Course code already exists', 'COURSE_CODE_TAKEN'); throw err; }
  }
  async getCourses(filter = {}, options = {}) { return catalogRepo.findCourses(filter, options); }
  async getCourse(id) { const c = await catalogRepo.findCourseById(id); if (!c) throw AppError.notFound('Course'); return c; }
  async updateCourse(id, data) { const c = await catalogRepo.updateCourse(id, pick(data, ['title', 'credits', 'type', 'level', 'description', 'isActive'])); if (!c) throw AppError.notFound('Course'); return c; }
  async searchCourses(query) { return catalogRepo.searchCourses(query); }

  // ── Syllabus ─────────────────────────────────────────────────────────────
  async upsertSyllabus(courseId, data) {
    const course = await catalogRepo.findCourseById(courseId);
    if (!course) throw AppError.notFound('Course');
    return catalogRepo.upsertSyllabus(courseId, data);
  }
  async getLatestSyllabus(courseId) {
    const syllabus = await catalogRepo.getLatestSyllabus(courseId);
    if (!syllabus) throw AppError.notFound('Syllabus');
    return syllabus;
  }

  // ── Prerequisites ────────────────────────────────────────────────────────
  async addPrerequisite(courseId, requiresCourseId, minimumGrade) {
    try { return await catalogRepo.addPrerequisite({ courseId, requiresCourseId, minimumGrade }); }
    catch (err) { if (err.code === 11000) throw AppError.conflict('This prerequisite already exists', 'PREREQ_EXISTS'); throw err; }
  }
  async getPrerequisites(courseId) { return catalogRepo.getPrerequisites(courseId); }

  // ── Curriculum ───────────────────────────────────────────────────────────
  async createCurriculum(data) {
    const curriculum = await catalogRepo.createCurriculum(data);
    await publisher.publish('academic.events', {
      eventType: 'academic.curriculum_updated',
      payload: { programId: data.programId?.toString(), version: data.version },
    });
    return curriculum;
  }
  async getActiveCurriculum(programId) { return catalogRepo.getActiveCurriculum(programId); }
  async activateCurriculum(id, programId) { return catalogRepo.activateCurriculum(id, programId); }
}

module.exports = new CatalogService();
