'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/ReportController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

router.use(authenticate);
router.use(requireRole('ADMIN', 'SUPER_ADMIN'));

router.post('/academic', controller.generateAcademic);
router.get('/academic',  controller.getAcademicList);

router.post('/financial', controller.generateFinancial);
router.get('/financial',  controller.getFinancialList);

router.get('/audit', controller.getAuditTrail);

module.exports = router;
