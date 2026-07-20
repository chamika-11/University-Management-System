'use strict';

const profileService = require('../services/ProfileService');
const asyncHandler = require('../utils/asyncHandler');

class ProfileController {
  // ── Students ──────────────────────────────────────────────────────────────
  createStudent = asyncHandler(async (req, res) => {
    const profile = await profileService.createProfile(req.user.id, 'STUDENT', req.body);
    res.status(201).json({ success: true, data: { profile } });
  });

  getMyProfile = asyncHandler(async (req, res) => {
    const profile = await profileService.getProfile(req.user.id, req.user.role);
    res.status(200).json({ success: true, data: { profile } });
  });

  getStudents = asyncHandler(async (req, res) => {
    const { page, limit, enrollmentStatus, programId } = req.query;
    const filter = {};
    if (enrollmentStatus) filter.enrollmentStatus = enrollmentStatus;
    if (programId) filter.programId = programId;
    const result = await profileService.getAllProfiles('STUDENT', filter, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  getStudent = asyncHandler(async (req, res) => {
    const profile = await profileService.getProfile(req.params.userId, 'STUDENT');
    res.status(200).json({ success: true, data: { profile } });
  });

  updateStudent = asyncHandler(async (req, res) => {
    const profile = await profileService.updateProfile(req.params.userId || req.user.id, 'STUDENT', req.body);
    res.status(200).json({ success: true, data: { profile } });
  });

  // ── Faculty ───────────────────────────────────────────────────────────────
  createFaculty = asyncHandler(async (req, res) => {
    const profile = await profileService.createProfile(req.user.id, 'FACULTY', req.body);
    res.status(201).json({ success: true, data: { profile } });
  });

  getFaculty = asyncHandler(async (req, res) => {
    const { page, limit, departmentId } = req.query;
    const filter = departmentId ? { departmentId } : {};
    const result = await profileService.getAllProfiles('FACULTY', filter, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  getFacultyMember = asyncHandler(async (req, res) => {
    const profile = await profileService.getProfile(req.params.userId, 'FACULTY');
    res.status(200).json({ success: true, data: { profile } });
  });

  updateFaculty = asyncHandler(async (req, res) => {
    const profile = await profileService.updateProfile(req.params.userId || req.user.id, 'FACULTY', req.body);
    res.status(200).json({ success: true, data: { profile } });
  });

  // ── Addresses & Emergency Contacts ────────────────────────────────────────
  addAddress = asyncHandler(async (req, res) => {
    const address = await profileService.addAddress(req.user.id, req.user.role, req.body);
    res.status(201).json({ success: true, data: { address } });
  });

  getAddresses = asyncHandler(async (req, res) => {
    const addresses = await profileService.getAddresses(req.user.id);
    res.status(200).json({ success: true, data: { addresses } });
  });

  addEmergencyContact = asyncHandler(async (req, res) => {
    const contact = await profileService.addEmergencyContact(req.user.id, req.body);
    res.status(201).json({ success: true, data: { contact } });
  });

  getEmergencyContacts = asyncHandler(async (req, res) => {
    const contacts = await profileService.getEmergencyContacts(req.user.id);
    res.status(200).json({ success: true, data: { contacts } });
  });
}

module.exports = new ProfileController();
