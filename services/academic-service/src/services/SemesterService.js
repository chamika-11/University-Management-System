'use strict';

const semesterRepo = require('../repositories/semester.repository');
const AppError = require('../utils/AppError');
const pick = require('../utils/pick');

class SemesterService {
  // Academic Years
  async createAcademicYear(data) { return semesterRepo.createAcademicYear(data); }
  async getAcademicYears() { return semesterRepo.getAcademicYears(); }
  async setActiveYear(id) { return semesterRepo.setActiveYear(id); }

  // Semesters
  async createSemester(data) { return semesterRepo.createSemester(data); }
  async getSemesters(filter = {}) { return semesterRepo.findSemesters(filter); }
  async getSemester(id) { const s = await semesterRepo.findSemesterById(id); if (!s) throw AppError.notFound('Semester'); return s; }
  async getCurrentSemester() { const s = await semesterRepo.getActiveSemester(); if (!s) throw AppError.notFound('Active semester'); return s; }
  async updateSemesterStatus(id, status) { return semesterRepo.updateSemester(id, { status }); }

  // Sections
  async createSection(data) {
    try { return await semesterRepo.createSection(data); }
    catch (err) { if (err.code === 11000) throw AppError.conflict('Section code already exists for this course/semester', 'SECTION_EXISTS'); throw err; }
  }
  async getSections(filter = {}) { return semesterRepo.findSections(filter); }
  async getSectionsByCourseSemester(courseId, semesterId) { return semesterRepo.findSectionsByCourseSemester(courseId, semesterId); }
  async getSectionById(id) { const s = await semesterRepo.findSectionById(id); if (!s) throw AppError.notFound('Section'); return s; }
  async updateSection(id, data) {
    const allowed = pick(data, ['capacity', 'facultyId', 'room', 'schedule', 'deliveryMode', 'isActive']);
    const s = await semesterRepo.updateSection(id, allowed);
    if (!s) throw AppError.notFound('Section');
    return s;
  }
}

module.exports = new SemesterService();
