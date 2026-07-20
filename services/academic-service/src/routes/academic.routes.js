'use strict';

const express = require('express');
const router = express.Router();
const catalog = require('../controllers/CatalogController');
const semester = require('../controllers/SemesterController');
const enrollment = require('../controllers/EnrollmentController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');

router.use(authenticate);

// ── Colleges ──────────────────────────────────────────────────────────
router.get('/colleges',             catalog.getColleges);
router.post('/colleges',            requireRole('ADMIN', 'SUPER_ADMIN'), catalog.createCollege);
router.get('/colleges/:id',         catalog.getCollege);
router.patch('/colleges/:id',       requireRole('ADMIN', 'SUPER_ADMIN'), catalog.updateCollege);

// ── Departments ────────────────────────────────────────────────────────
router.get('/departments',          catalog.getDepartments);
router.post('/departments',         requireRole('ADMIN', 'SUPER_ADMIN'), catalog.createDepartment);
router.get('/departments/:id',      catalog.getDepartment);
router.patch('/departments/:id',    requireRole('ADMIN', 'SUPER_ADMIN'), catalog.updateDepartment);

// ── Programs ───────────────────────────────────────────────────────────
router.get('/programs',             catalog.getPrograms);
router.post('/programs',            requireRole('ADMIN', 'SUPER_ADMIN'), catalog.createProgram);
router.get('/programs/:id',         catalog.getProgram);

// ── Courses ────────────────────────────────────────────────────────────
router.get('/courses',              catalog.getCourses);
router.post('/courses',             requireRole('ADMIN', 'FACULTY', 'SUPER_ADMIN'), catalog.createCourse);
router.get('/courses/:id',          catalog.getCourse);
router.patch('/courses/:id',        requireRole('ADMIN', 'FACULTY', 'SUPER_ADMIN'), catalog.updateCourse);
router.get('/courses/:id/syllabus', catalog.getSyllabus);
router.put('/courses/:id/syllabus', requireRole('FACULTY', 'ADMIN', 'SUPER_ADMIN'), catalog.upsertSyllabus);
router.get('/courses/:id/prerequisites', catalog.getPrerequisites);
router.post('/courses/:id/prerequisites', requireRole('ADMIN', 'SUPER_ADMIN'), catalog.addPrerequisite);

// ── Semesters ──────────────────────────────────────────────────────────
router.get('/academic-years',       semester.getYears);
router.post('/academic-years',      requireRole('ADMIN', 'SUPER_ADMIN'), semester.createYear);
router.get('/semesters',            semester.getSemesters);
router.post('/semesters',           requireRole('ADMIN', 'SUPER_ADMIN'), semester.createSemester);
router.get('/semesters/current',    semester.getCurrent);
router.get('/semesters/:id',        semester.getSemester);
router.get('/semesters/:id/sections', semester.getSemesterSections);

// ── Sections ───────────────────────────────────────────────────────────
router.get('/sections',             semester.getSections);
router.post('/sections',            requireRole('ADMIN', 'SUPER_ADMIN'), semester.createSection);
router.patch('/sections/:sectionId', requireRole('ADMIN', 'SUPER_ADMIN', 'FACULTY'), semester.updateSection);
router.get('/sections/:sectionId/enrollments', requireRole('ADMIN', 'FACULTY', 'SUPER_ADMIN'), enrollment.getSectionEnrollments);

module.exports = router;
