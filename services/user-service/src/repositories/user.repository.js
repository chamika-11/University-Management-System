'use strict';

const User = require('../models/User.model');
const paginate = require('../utils/paginate');

class UserRepository {
  async create(data) {
    return User.create(data);
  }

  async findById(id, withPassword = false) {
    let q = User.findById(id).populate('roleId');
    if (withPassword) q = q.select('+passwordHash');
    return q.exec();
  }

  async findByEmail(email, withPassword = false) {
    let q = User.findOne({ email: email.toLowerCase() });
    if (withPassword) q = q.select('+passwordHash');
    return q.exec();
  }

  async findAll(filter = {}, options = {}) {
    return paginate(User, filter, { ...options, populate: 'roleId' });
  }

  async updateById(id, data) {
    return User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).populate('roleId');
  }

  async deleteById(id) {
    const StudentProfile = require('../models/StudentProfile.model');
    const FacultyProfile = require('../models/FacultyProfile.model');
    const AdminProfile = require('../models/AdminProfile.model');
    const StaffProfile = require('../models/StaffProfile.model');

    await Promise.all([
      StudentProfile.deleteMany({ userId: id }).catch(() => {}),
      FacultyProfile.deleteMany({ userId: id }).catch(() => {}),
      AdminProfile.deleteMany({ userId: id }).catch(() => {}),
      StaffProfile.deleteMany({ userId: id }).catch(() => {}),
    ]);

    return User.findByIdAndDelete(id);
  }

  async incrementLoginAttempts(userId) {
    return User.findByIdAndUpdate(userId, { $inc: { loginAttempts: 1 } }, { new: true });
  }

  async resetLoginAttempts(userId) {
    return User.findByIdAndUpdate(userId, { $set: { loginAttempts: 0, lockedUntil: null } }, { new: true });
  }

  async lockAccount(userId, until) {
    return User.findByIdAndUpdate(userId, { $set: { lockedUntil: until, status: 'SUSPENDED' } }, { new: true });
  }

  async unlockAccount(userId) {
    return User.findByIdAndUpdate(userId, { $set: { lockedUntil: null, loginAttempts: 0, status: 'ACTIVE' } }, { new: true });
  }

  async updateLastLogin(userId) {
    return User.findByIdAndUpdate(userId, { $set: { lastLogin: new Date() } });
  }

  async countByProfileType(profileType) {
    return User.countDocuments({ profileType });
  }

  async existsByEmail(email) {
    return User.exists({ email: email.toLowerCase() });
  }
}

module.exports = new UserRepository();
