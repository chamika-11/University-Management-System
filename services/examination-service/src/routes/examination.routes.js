'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/ExamScheduleController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

router.use(authenticate);

router.get('/schedules', controller.list);
router.get('/tickets',    controller.getTicket);

router.post('/schedules', requireRole('ADMIN', 'SUPER_ADMIN'), controller.schedule);
router.post('/tickets',   requireRole('ADMIN', 'SUPER_ADMIN'), controller.generateTicket);
router.patch('/tickets/:id/approve', requireRole('ADMIN', 'SUPER_ADMIN'), controller.approveTicket);

module.exports = router;
