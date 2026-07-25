'use strict';

const StudentProfile = require('../models/StudentProfile.model');
const FacultyProfile = require('../models/FacultyProfile.model');
const AdminProfile = require('../models/AdminProfile.model');
const StaffProfile = require('../models/StaffProfile.model');
const Address = require('../models/Address.model');
const EmergencyContact = require('../models/EmergencyContact.model');
const paginate = require('../utils/paginate');

const modelMap = {
  STUDENT: StudentProfile,
  FACULTY: FacultyProfile,
  ADMIN: AdminProfile,
  STAFF: StaffProfile,
};

class ProfileRepository {
  _getModel(type) {
    const Model = modelMap[type?.toUpperCase()];
    if (!Model) throw new Error(`Unknown profile type: ${type}`);
    return Model;
  }

  async create(type, data) { return this._getModel(type).create(data); }
  async findByUserId(type, userId) { return this._getModel(type).findOne({ userId }); }
  async findById(type, id) { return this._getModel(type).findById(id); }
  async updateByUserId(type, userId, data) {
    return this._getModel(type).findOneAndUpdate({ userId }, { $set: data }, { new: true, runValidators: true });
  }
  async findAll(type, filter = {}, options = {}) { return paginate(this._getModel(type), filter, options); }
  async existsByUserId(type, userId) { return this._getModel(type).exists({ userId }); }

  // Addresses
  async createAddress(data) { return Address.create(data); }
  async findAddresses(ownerId) { return Address.find({ ownerId }).sort({ isPrimary: -1 }); }
  async updateAddress(id, data) { return Address.findByIdAndUpdate(id, { $set: data }, { new: true }); }
  async deleteAddress(id) { return Address.findByIdAndDelete(id); }

  // Emergency contacts
  async createEmergencyContact(data) { return EmergencyContact.create(data); }
  async findEmergencyContacts(ownerId) { return EmergencyContact.find({ ownerId }).sort({ isPrimary: -1 }); }
  async deleteEmergencyContact(id) { return EmergencyContact.findByIdAndDelete(id); }
}

module.exports = new ProfileRepository();
