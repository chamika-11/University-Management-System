'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/GradeController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

router.use(authenticate);

router.get('/transcript', controller.getTranscript);
router.get('/transcript/:studentId', requireRole('ADMIN', 'FACULTY', 'SUPER_ADMIN'), controller.getTranscript);

router.get('/grades', controller.getGrades);
router.post('/grades', requireRole('FACULTY', 'ADMIN'), controller.submit);
router.post('/grades/publish', requireRole('ADMIN', 'SUPER_ADMIN'), controller.publish);

// Appeals
router.post('/appeals', requireRole('STUDENT'), controller.appeal);
router.get('/appeals', controller.getAppeals);
router.patch('/appeals/:id/resolve', requireRole('FACULTY', 'ADMIN'), controller.resolveAppeal);

module.exports = router;
