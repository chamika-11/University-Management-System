'use strict';

const express = require('express');
const router = express.Router();
const enrollment = require('../controllers/EnrollmentController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

router.use(authenticate);

router.post('/',                  requireRole('STUDENT'),                enrollment.enroll);
router.get('/',                   enrollment.getMyEnrollments);
router.delete('/:id',             requireRole('STUDENT'),                enrollment.drop);

router.get('/waitlist',           enrollment.getMyWaitlists);
router.post('/waitlist',          requireRole('STUDENT'),                enrollment.joinWaitlist);
router.delete('/waitlist/:sectionId', requireRole('STUDENT'),            enrollment.leaveWaitlist);

module.exports = router;
