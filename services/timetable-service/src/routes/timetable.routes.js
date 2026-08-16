'use strict';

const express = require('express');
const router = express.Router();
const sc = require('../controllers/ScheduleController');
const at = require('../controllers/AttendanceController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

router.use(authenticate);

// ── Time Slots ──────────────────────────────────────────────────────────
router.get('/timeslots', sc.getTimeSlots);
router.post('/timeslots', requireRole('ADMIN'), sc.createTimeSlot);

// ── Classrooms ──────────────────────────────────────────────────────────
router.get('/classrooms', sc.getClassrooms);
router.post('/classrooms', requireRole('ADMIN'), sc.createClassroom);
router.get('/classrooms/:id', sc.getClassroom);
router.patch('/classrooms/:id', requireRole('ADMIN'), sc.updateClassroom);

// ── Schedules ───────────────────────────────────────────────────────────
router.post('/schedules', requireRole('ADMIN'), sc.createSchedule);
router.get('/schedules/semester/:semesterId', sc.getSchedulesBySemester);
router.get('/schedules/section/:sectionId', sc.getSchedulesBySection);
router.get('/schedules/:id', sc.getSchedule);
router.patch('/schedules/:id', requireRole('ADMIN'), sc.updateSchedule);
router.post('/schedules/:scheduleId/cancel', requireRole('ADMIN', 'FACULTY'), sc.cancelClass);

// ── Holidays ────────────────────────────────────────────────────────────
router.get('/holidays', sc.getHolidays);
router.post('/holidays', requireRole('ADMIN'), sc.addHoliday);

// ── Attendance Sessions ─────────────────────────────────────────────────
router.post('/attendance/sessions', requireRole('FACULTY', 'ADMIN'), at.openSession);
router.post('/attendance/sessions/:sessionId/close', requireRole('FACULTY', 'ADMIN'), at.closeSession);
router.get('/attendance/sessions/:sessionId', at.getSessionAttendance);
router.get('/attendance/sections/:sectionId/sessions', at.getSectionSessions);

// ── Attendance Records ──────────────────────────────────────────────────
router.post('/attendance/sessions/:sessionId/mark', requireRole('FACULTY', 'ADMIN'), at.markAttendance);
router.post('/attendance/sessions/:sessionId/bulk-mark', requireRole('FACULTY', 'ADMIN'), at.bulkMarkAttendance);
router.get('/attendance/me', requireRole('STUDENT'), at.getMyAttendance);
router.get('/attendance/students/:studentId', requireRole('FACULTY', 'ADMIN'), at.getStudentAttendance);

module.exports = router;
