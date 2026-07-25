'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/AssignmentController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

router.use(authenticate);

router.post('/',              requireRole('FACULTY', 'ADMIN'), controller.create);
router.get('/',               controller.list);

router.post('/:id/submit',    requireRole('STUDENT'), controller.submit);
router.get('/:id/submissions', requireRole('FACULTY', 'ADMIN'), controller.getSubmissions);
router.post('/submissions/:submissionId/grade', requireRole('FACULTY', 'ADMIN'), controller.grade);

module.exports = router;
