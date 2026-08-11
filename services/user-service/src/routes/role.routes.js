'use strict';

const express = require('express');
const router = express.Router();
const rbacController = require('../controllers/RBACController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const { createRoleSchema, createPermissionSchema, assignPermissionsSchema } = require('../validators/role.validator');

router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/',                    rbacController.getRoles);
router.post('/',                   validate(createRoleSchema),       rbacController.createRole);
router.patch('/:id',                                                 rbacController.updateRole);
router.delete('/:id',              requireRole('ADMIN'),             rbacController.deleteRole);
router.post('/:id/permissions',    validate(assignPermissionsSchema), rbacController.assignPermissions);

router.get('/permissions',         rbacController.getPermissions);
router.post('/permissions',        validate(createPermissionSchema), rbacController.createPermission);

module.exports = router;
