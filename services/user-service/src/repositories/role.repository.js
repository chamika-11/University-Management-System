'use strict';

const Role = require('../models/Role.model');
const Permission = require('../models/Permission.model');

class RoleRepository {
  async create(data) { return Role.create(data); }
  async findById(id) { return Role.findById(id).populate('permissions'); }
  async findByName(name) { return Role.findOne({ name: name.toUpperCase() }).populate('permissions'); }
  async findAll() { return Role.find().populate('permissions').sort({ name: 1 }); }
  async updateById(id, data) { return Role.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).populate('permissions'); }
  async deleteById(id) { return Role.findByIdAndDelete(id); }
  async addPermissions(roleId, permissionIds) {
    return Role.findByIdAndUpdate(roleId, { $addToSet: { permissions: { $each: permissionIds } } }, { new: true }).populate('permissions');
  }
  async removePermission(roleId, permissionId) {
    return Role.findByIdAndUpdate(roleId, { $pull: { permissions: permissionId } }, { new: true }).populate('permissions');
  }
  async getDefaultRoleForType(profileType) {
    const roleNameMap = { STUDENT: 'STUDENT', FACULTY: 'FACULTY', ADMIN: 'ADMIN', STAFF: 'STAFF' };
    return Role.findOne({ name: roleNameMap[profileType] || profileType });
  }

  // Permissions
  async createPermission(data) { return Permission.create(data); }
  async findAllPermissions(filter = {}) { return Permission.find(filter).sort({ resource: 1, action: 1 }); }
  async findPermissionById(id) { return Permission.findById(id); }
}

module.exports = new RoleRepository();
