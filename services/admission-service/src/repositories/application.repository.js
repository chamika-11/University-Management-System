'use strict';

const Application = require('../models/Application.model');
const AdmissionCycle = require('../models/AdmissionCycle.model');
const paginate = require('../utils/paginate');

class ApplicationRepository {
  async createApplication(data) {
    return Application.create(data);
  }

  async findApplicationById(id) {
    return Application.findById(id).populate('cycleId');
  }

  async findByApplicantId(applicantId) {
    return Application.findOne({ applicantId }).populate('cycleId');
  }

  async findByEmailAndCycle(email, cycleId) {
    return Application.findOne({ email: email.toLowerCase(), cycleId });
  }

  async findApplications(filter = {}, options = {}) {
    return paginate(Application, filter, { ...options, populate: 'cycleId' });
  }

  async updateApplication(id, data) {
    return Application.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).populate('cycleId');
  }

  // Cycles
  async createCycle(data) {
    return AdmissionCycle.create(data);
  }

  async findActiveCycle() {
    return AdmissionCycle.findOne({ isActive: true });
  }

  async findAllCycles() {
    return AdmissionCycle.find().sort({ startDate: -1 });
  }
}

module.exports = new ApplicationRepository();
