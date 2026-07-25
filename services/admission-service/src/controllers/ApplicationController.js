'use strict';

const appService = require('../services/ApplicationProcessingService');
const appRepo = require('../repositories/application.repository');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

class ApplicationController {
  submit = asyncHandler(async (req, res) => {
    const applicantId = req.user?.id || 'APPLICANT-TEMP';
    const app = await appService.submitApplication({ ...req.body, applicantId });
    res.status(201).json({ success: true, data: { application: app } });
  });

  uploadDocs = asyncHandler(async (req, res) => {
    const app = await appService.uploadDocuments(req.params.id, req.body.documents);
    res.status(200).json({ success: true, data: { application: app } });
  });

  evaluate = asyncHandler(async (req, res) => {
    const app = await appService.evaluateEligibility(req.params.id, req.body.meritScore);
    res.status(200).json({ success: true, data: { application: app } });
  });

  generateOffer = asyncHandler(async (req, res) => {
    const app = await appService.generateOfferLetter(req.params.id);
    res.status(200).json({ success: true, data: { application: app } });
  });

  acceptOffer = asyncHandler(async (req, res) => {
    const app = await appService.acceptOffer(req.params.id);
    res.status(200).json({ success: true, data: { application: app } });
  });

  confirm = asyncHandler(async (req, res) => {
    const app = await appService.confirmAdmission(req.params.id);
    res.status(200).json({ success: true, data: { application: app } });
  });

  getOne = asyncHandler(async (req, res) => {
    const app = await appRepo.findApplicationById(req.params.id);
    if (!app) throw AppError.notFound('Application');
    res.status(200).json({ success: true, data: { application: app } });
  });

  getAll = asyncHandler(async (req, res) => {
    const { page, limit, status } = req.query;
    const filter = status ? { status } : {};
    const result = await appRepo.findApplications(filter, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  createCycle = asyncHandler(async (req, res) => {
    const cycle = await appRepo.createCycle(req.body);
    res.status(201).json({ success: true, data: { cycle } });
  });

  getCycles = asyncHandler(async (req, res) => {
    const cycles = await appRepo.findAllCycles();
    res.status(200).json({ success: true, data: { cycles } });
  });
}

module.exports = new ApplicationController();
