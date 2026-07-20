'use strict';

const Semester = require('../models/Semester.model');
const AcademicYear = require('../models/AcademicYear.model');
const CourseSection = require('../models/CourseSection.model');
const RegistrationWindow = require('../models/RegistrationWindow.model');

class SemesterRepository {
  // Academic Years
  async createAcademicYear(data) { return AcademicYear.create(data); }
  async getAcademicYears() { return AcademicYear.find().sort({ year: -1 }); }
  async getActiveAcademicYear() { return AcademicYear.findOne({ isActive: true }); }
  async setActiveYear(id) {
    await AcademicYear.updateMany({}, { $set: { isActive: false } });
    return AcademicYear.findByIdAndUpdate(id, { $set: { isActive: true } }, { new: true });
  }

  // Semesters
  async createSemester(data) { return Semester.create(data); }
  async findSemesters(filter = {}) { return Semester.find(filter).populate('academicYearId').sort({ startDate: -1 }); }
  async findSemesterById(id) { return Semester.findById(id).populate('academicYearId'); }
  async getActiveSemester() { return Semester.findOne({ status: 'ACTIVE' }).populate('academicYearId'); }
  async updateSemester(id, data) { return Semester.findByIdAndUpdate(id, { $set: data }, { new: true }); }

  // Course Sections
  async createSection(data) { return CourseSection.create(data); }
  async findSections(filter = {}) { return CourseSection.find(filter).populate('courseId semesterId'); }
  async findSectionById(id) { return CourseSection.findById(id).populate('courseId semesterId'); }
  async findSectionsByCourseSemester(courseId, semesterId) { return CourseSection.find({ courseId, semesterId }); }
  async incrementEnrolled(sectionId) { return CourseSection.findByIdAndUpdate(sectionId, { $inc: { enrolled: 1 } }, { new: true }); }
  async decrementEnrolled(sectionId) { return CourseSection.findByIdAndUpdate(sectionId, { $inc: { enrolled: -1 } }, { new: true }); }
  async updateSection(id, data) { return CourseSection.findByIdAndUpdate(id, { $set: data }, { new: true }); }

  // Registration Windows
  async createWindow(data) { return RegistrationWindow.create(data); }
  async getActiveWindow(semesterId) { return RegistrationWindow.findOne({ semesterId, isActive: true, openDate: { $lte: new Date() }, closeDate: { $gte: new Date() } }); }
}

module.exports = new SemesterRepository();
