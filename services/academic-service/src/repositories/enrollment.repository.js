'use strict';

const Enrollment = require('../models/Enrollment.model');
const WaitlistEntry = require('../models/WaitlistEntry.model');
const paginate = require('../utils/paginate');

class EnrollmentRepository {
  async create(data) { return Enrollment.create(data); }
  async findById(id) { return Enrollment.findById(id).populate('sectionId semesterId'); }
  async findByStudentSemester(studentId, semesterId, status) {
    const filter = { studentId, semesterId };
    if (status) filter.status = status;
    return Enrollment.find(filter).populate({ path: 'sectionId', populate: { path: 'courseId' } });
  }
  async findByStudentSection(studentId, sectionId) { return Enrollment.findOne({ studentId, sectionId }); }
  async findBySectionId(sectionId, options = {}) { return paginate(Enrollment, { sectionId, status: { $in: ['CONFIRMED', 'PENDING'] } }, options); }
  async updateStatus(id, status, extra = {}) { return Enrollment.findByIdAndUpdate(id, { $set: { status, ...extra } }, { new: true }); }
  async softDelete(id) { return Enrollment.findByIdAndUpdate(id, { $set: { status: 'DROPPED', droppedAt: new Date() } }, { new: true }); }
  async findAll(filter = {}, options = {}) { return paginate(Enrollment, filter, options); }

  // Waitlist
  async getNextWaitlistPosition(sectionId) {
    const max = await WaitlistEntry.findOne({ sectionId, status: 'WAITING' }).sort({ position: -1 });
    return (max?.position || 0) + 1;
  }
  async addToWaitlist(data) {
    const position = await this.getNextWaitlistPosition(data.sectionId);
    return WaitlistEntry.create({ ...data, position });
  }
  async getWaitlist(sectionId) { return WaitlistEntry.find({ sectionId, status: 'WAITING' }).sort({ position: 1 }); }
  async getStudentWaitlistEntry(sectionId, studentId) { return WaitlistEntry.findOne({ sectionId, studentId, status: 'WAITING' }); }
  async promoteFromWaitlist(entryId) { return WaitlistEntry.findByIdAndUpdate(entryId, { $set: { status: 'PROMOTED', promotedAt: new Date() } }, { new: true }); }
  async removeFromWaitlist(sectionId, studentId) { return WaitlistEntry.findOneAndUpdate({ sectionId, studentId }, { $set: { status: 'REMOVED' } }, { new: true }); }
  async getStudentWaitlists(studentId) { return WaitlistEntry.find({ studentId, status: 'WAITING' }).populate('sectionId'); }
}

module.exports = new EnrollmentRepository();
