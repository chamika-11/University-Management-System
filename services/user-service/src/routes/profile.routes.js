'use strict';

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/ProfileController');
const authenticate = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createStudentSchema,
  createFacultySchema,
  addAddressSchema,
  addEmergencyContactSchema,
} = require('../validators/profile.validator');

router.use(authenticate);

// My own profile
router.get('/profile/me', profileController.getMyProfile);

// Student profiles
router.get('/students',             requireRole('ADMIN', 'FACULTY', 'SUPER_ADMIN', 'STAFF'), profileController.getStudents);
router.post('/students',            validate(createStudentSchema),                           profileController.createStudent);
router.get('/students/:userId',     requireRole('ADMIN', 'FACULTY', 'SUPER_ADMIN'),          profileController.getStudent);
router.patch('/students/:userId',   requireRole('ADMIN', 'SUPER_ADMIN'),                     profileController.updateStudent);

// Faculty profiles
router.get('/faculty',              requireRole('ADMIN', 'SUPER_ADMIN', 'STAFF'),            profileController.getFaculty);
router.post('/faculty',             requireRole('ADMIN', 'SUPER_ADMIN'), validate(createFacultySchema), profileController.createFaculty);
router.get('/faculty/:userId',                                                               profileController.getFacultyMember);
router.patch('/faculty/:userId',    requireRole('ADMIN', 'SUPER_ADMIN'),                     profileController.updateFaculty);

// Addresses
router.get('/addresses',            profileController.getAddresses);
router.post('/addresses',           validate(addAddressSchema),                              profileController.addAddress);

// Emergency contacts
router.get('/emergency-contacts',   profileController.getEmergencyContacts);
router.post('/emergency-contacts',  validate(addEmergencyContactSchema),                     profileController.addEmergencyContact);

module.exports = router;
