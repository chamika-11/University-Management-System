'use strict';

const AcademicReport = require('../models/AcademicReport.model');
const FinancialReport = require('../models/FinancialReport.model');
const AuditLog = require('../models/AuditLog.model');
const paginate = require('../utils/paginate');

class ReportingRepository {
  async saveAcademicReport(data) { return AcademicReport.create(data); }
  async getAcademicReports(options = {}) { return paginate(AcademicReport, {}, options); }

  async saveFinancialReport(data) { return FinancialReport.create(data); }
  async getFinancialReports(options = {}) { return paginate(FinancialReport, {}, options); }

  async saveAuditLog(data) { return AuditLog.create(data); }
  async getAuditLogs(filter = {}, options = {}) { return paginate(AuditLog, filter, options); }
}

module.exports = new ReportingRepository();
