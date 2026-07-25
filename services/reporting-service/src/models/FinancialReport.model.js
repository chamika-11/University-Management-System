'use strict';

const mongoose = require('mongoose');

const financialReportSchema = new mongoose.Schema({
  reportName:   { type: String, required: true },
  totalBilled:  { type: Number, default: 0 },
  totalPaid:    { type: Number, default: 0 },
  totalUnpaid:  { type: Number, default: 0 },
  currency:     { type: String, default: 'USD' },
  generatedBy:  { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('FinancialReport', financialReportSchema);
