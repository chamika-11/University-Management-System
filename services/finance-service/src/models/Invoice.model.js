'use strict';

const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  userId:      { type: String, required: true, index: true },
  amount:      { type: Number, required: true, min: 0 },
  currency:    { type: String, required: true, default: 'USD' },
  purpose:     { type: String, enum: ['APPLICATION_FEE', 'TUITION_FEE', 'LATE_REGISTRATION_FEE', 'LIBRARY_FINE'], required: true },
  referenceId: { type: String, required: true, index: true }, // e.g. applicationId or enrollmentId
  status:      { type: String, enum: ['UNPAID', 'PAID', 'OVERDUE', 'VOID'], default: 'UNPAID' },
  dueDate:     { type: Date, required: true },
  paidAt:      { type: Date, default: null },
  transactionId: { type: String, default: null },
}, { timestamps: true });

invoiceSchema.index({ userId: 1, status: 1 });
module.exports = mongoose.model('Invoice', invoiceSchema);
