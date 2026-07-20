'use strict';

const mongoose = require('mongoose');

const ledgerEntrySchema = new mongoose.Schema({
  accountId:   { type: String, required: true, index: true }, // e.g. "STUDENT:userId" or "REVENUE:TUITION"
  entryType:   { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
  amount:      { type: Number, required: true, min: 0 },
  currency:    { type: String, required: true, default: 'USD' },
  description: { type: String, required: true },
  invoiceId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', default: null },
}, { timestamps: true });

ledgerEntrySchema.index({ accountId: 1, createdAt: -1 });
module.exports = mongoose.model('LedgerEntry', ledgerEntrySchema);
