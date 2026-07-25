'use strict';

const repo = require('../repositories/reporting.repository');
const mongoose = require('mongoose');

class ReportGenerationService {
  /**
   * Generates a snapshot report for academic outcomes.
   */
  async generateAcademicReport({ semesterId, generatedBy }) {
    // Aggregation query on grading database (simulated here using read-only mocks)
    const report = await repo.saveAcademicReport({
      reportName: `Academic Performance Report — ${semesterId}`,
      semesterId,
      totalStudents: 150,
      averageCgpa: 7.25,
      passPercentage: 92.5,
      generatedBy,
    });
    return report;
  }

  /**
   * Generates a snapshot report for invoices and revenues.
   */
  async generateFinancialReport({ reportName, generatedBy }) {
    const report = await repo.saveFinancialReport({
      reportName,
      totalBilled: 45000,
      totalPaid: 32000,
      totalUnpaid: 13000,
      currency: 'USD',
      generatedBy,
    });
    return report;
  }

  async recordLog(data) {
    return repo.saveAuditLog(data);
  }
}

module.exports = new ReportGenerationService();
