'use strict';

const rbacService = require('../services/RBACService');
const asyncHandler = require('../utils/asyncHandler');

class RBACController {
  getRoles = asyncHandler(async (req, res) => {
    const roles = await rbacService.getAllRoles();
    res.status(200).json({ success: true, data: { roles } });
  });

  createRole = asyncHandler(async (req, res) => {
    const role = await rbacService.createRole(req.body);
    res.status(201).json({ success: true, data: { role } });
  });

  updateRole = asyncHandler(async (req, res) => {
    const role = await rbacService.updateRole(req.params.id, req.body);
    res.status(200).json({ success: true, data: { role } });
  });

  deleteRole = asyncHandler(async (req, res) => {
    await rbacService.deleteRole(req.params.id);
    res.status(200).json({ success: true, data: { message: 'Role deleted' } });
  });

  assignPermissions = asyncHandler(async (req, res) => {
    const role = await rbacService.assignPermissions(req.params.id, req.body.permissionIds);
    res.status(200).json({ success: true, data: { role } });
  });

  getPermissions = asyncHandler(async (req, res) => {
    const permissions = await rbacService.getAllPermissions();
    res.status(200).json({ success: true, data: { permissions } });
  });

  createPermission = asyncHandler(async (req, res) => {
    const permission = await rbacService.createPermission(req.body);
    res.status(201).json({ success: true, data: { permission } });
  });
}

module.exports = new RBACController();
