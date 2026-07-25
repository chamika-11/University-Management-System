'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/ModuleController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

router.use(authenticate);

// Course modules & lessons
router.post('/modules',       requireRole('FACULTY', 'ADMIN', 'SUPER_ADMIN'), controller.createModule);
router.get('/modules',        controller.getModules);
router.post('/lessons',       requireRole('FACULTY', 'ADMIN', 'SUPER_ADMIN'), controller.createLesson);
router.get('/modules/:moduleId/lessons', controller.getLessons);

// Live Sessions
router.post('/livesessions',                    requireRole('FACULTY', 'ADMIN', 'SUPER_ADMIN'), controller.scheduleSession);
router.post('/livesessions/:sessionId/end',      requireRole('FACULTY', 'ADMIN', 'SUPER_ADMIN'), controller.endSession);
router.get('/sections/:sectionId/livesessions', controller.getSessions);

module.exports = router;
