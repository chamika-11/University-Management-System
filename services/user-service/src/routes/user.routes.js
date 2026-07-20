'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const { listUsersSchema, updateUserSchema } = require('../validators/user.validator');

// All routes require authentication
router.use(authenticate);

router.get('/',     requireRole('ADMIN', 'SUPER_ADMIN'), validate(listUsersSchema), userController.getAll);
router.get('/:id',  requireRole('ADMIN', 'SUPER_ADMIN', 'FACULTY'),                userController.getOne);
router.patch('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validate(updateUserSchema), userController.update);
router.delete('/:id', requireRole('SUPER_ADMIN'),                                  userController.delete);
router.post('/:id/lock',   requireRole('ADMIN', 'SUPER_ADMIN'),                   userController.lock);
router.post('/:id/unlock', requireRole('ADMIN', 'SUPER_ADMIN'),                   userController.unlock);

module.exports = router;
