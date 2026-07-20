'use strict';

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicantId:  { type: String, required: true, index: true }, // temporary ID or user ID (if registered)
  cycleId:      { type: mongoose.Schema.Types.ObjectId, ref: 'AdmissionCycle', required: true, index: true },
  programId:    { type: String, required: true, index: true }, // references program in academic-service
  email:        { type: String, required: true, lowercase: true, trim: true },
  firstName:    { type: String, required: true, trim: true },
  lastName:     { type: String, required: true, trim: true },
  phone:        { type: String, trim: true },
  documents: [{
    docType:  { type: String, required: true }, // e.g., "TRANSCRIPT", "PASSPORT"
    fileUrl:  { type: String, required: true },
    verified: { type: Boolean, default: false },
  }],
  status: {
    type: String,
    enum: ['APPLIED', 'DOCUMENT_SUBMITTED', 'ELIGIBILITY_CHECKED', 'OFFER_GENERATED', 'OFFER_ACCEPTED', 'FEE_PAID', 'CONFIRMED', 'REJECTED'],
    default: 'APPLIED',
  },
  meritScore: { type: Number, default: 0 },
  offerLetterUrl: { type: String, default: null },
  feeInvoiceId: { type: String, default: null },
}, { timestamps: true });

applicationSchema.index({ email: 1, cycleId: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
module.exports = mongoose.model('Application', applicationSchema);
