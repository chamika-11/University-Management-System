'use strict';

const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  loanId:      { type: mongoose.Schema.Types.ObjectId, ref: 'BookLoan', required: true, unique: true },
  studentId:   { type: String, required: true, index: true },
  amount:      { type: Number, required: true, min: 0 },
  status:      { type: String, enum: ['UNPAID', 'PAID'], default: 'UNPAID' },
  fineInvoiceId: { type: String, default: null }, // reference to invoice generated in finance-service
}, { timestamps: true });

module.exports = mongoose.model('Fine', fineSchema);
