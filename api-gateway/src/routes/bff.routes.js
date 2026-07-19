const express = require('express');
const authVerify = require('../middlewares/authVerify.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');
const StudentDashboardAggregatorController = require('../controllers/StudentDashboardAggregatorController');
const FacultyDashboardAggregatorController = require('../controllers/FacultyDashboardAggregatorController');
const AdminDashboardAggregatorController = require('../controllers/AdminDashboardAggregatorController');

const router = express.Router();

router.get('/student/dashboard', authVerify, requireRole('student'), StudentDashboardAggregatorController.getDashboard);
router.get('/faculty/dashboard', authVerify, requireRole('faculty'), FacultyDashboardAggregatorController.getDashboard);
router.get('/admin/dashboard', authVerify, requireRole('admin', 'super_admin'), AdminDashboardAggregatorController.getDashboard);

module.exports = router;
