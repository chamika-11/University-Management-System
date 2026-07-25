'use strict';

const service = require('../services/ReportGenerationService');
const repo = require('../repositories/reporting.repository');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

class ReportController {
  generateAcademic = asyncHandler(async (req, res) => {
    const { semesterId } = req.body;
    const report = await service.generateAcademicReport({ semesterId, generatedBy: req.user.id });
    res.status(201).json({ success: true, data: { report } });
  });

  generateFinancial = asyncHandler(async (req, res) => {
    const { reportName } = req.body;
    const report = await service.generateFinancialReport({ reportName, generatedBy: req.user.id });
    res.status(201).json({ success: true, data: { report } });
  });

  getAcademicList = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await repo.getAcademicReports({ page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  getFinancialList = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const result = await repo.getFinancialReports({ page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  getAuditTrail = asyncHandler(async (req, res) => {
    const { page, limit, userId } = req.query;
    const filter = userId ? { userId } : {};
    const result = await repo.getAuditLogs(filter, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });
}

module.exports = new ReportController();
