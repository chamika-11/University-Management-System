'use strict';

const roleRepo = require('../repositories/role.repository');
const AppError = require('../utils/AppError');

class RBACService {
  async createRole(data) {
    const existing = await roleRepo.findByName(data.name);
    if (existing) throw AppError.conflict(`Role '${data.name}' already exists`, 'ROLE_EXISTS');
    return roleRepo.create(data);
  }

  async updateRole(id, data) {
    const role = await roleRepo.findById(id);
    if (!role) throw AppError.notFound('Role');
    if (role.isSystem) throw AppError.forbidden('Cannot modify system roles', 'SYSTEM_ROLE');
    return roleRepo.updateById(id, data);
  }

  async deleteRole(id) {
    const role = await roleRepo.findById(id);
    if (!role) throw AppError.notFound('Role');
    if (role.isSystem) throw AppError.forbidden('Cannot delete system roles', 'SYSTEM_ROLE');
    return roleRepo.deleteById(id);
  }

  async getAllRoles() { return roleRepo.findAll(); }
  async getRoleById(id) {
    const role = await roleRepo.findById(id);
    if (!role) throw AppError.notFound('Role');
    return role;
  }

  async assignPermissions(roleId, permissionIds) {
    const role = await roleRepo.findById(roleId);
    if (!role) throw AppError.notFound('Role');
    return roleRepo.addPermissions(roleId, permissionIds);
  }

  async removePermission(roleId, permissionId) {
    const role = await roleRepo.findById(roleId);
    if (!role) throw AppError.notFound('Role');
    return roleRepo.removePermission(roleId, permissionId);
  }

  async createPermission(data) {
    const existing = await roleRepo.findAllPermissions({ resource: data.resource, action: data.action });
    if (existing.length) throw AppError.conflict(`Permission '${data.resource}:${data.action}' already exists`, 'PERMISSION_EXISTS');
    return roleRepo.createPermission(data);
  }

  async getAllPermissions(filter = {}) { return roleRepo.findAllPermissions(filter); }

  // Seed default roles and permissions for a fresh installation
  async seedDefaults() {
    const defaultRoles = ['STUDENT', 'FACULTY', 'ADMIN', 'STAFF'];
    for (const name of defaultRoles) {
      const exists = await roleRepo.findByName(name);
      if (!exists) {
        await roleRepo.create({ name, description: `Default ${name} role`, isSystem: true, isDefault: false });
      }
    }
  }
}

module.exports = new RBACService();
