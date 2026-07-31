'use strict';

const mongoose = require('mongoose');

const issuedCertificateSchema = new mongoose.Schema({
  studentId:      { type: String, required: true, index: true }, // student userId
  certificateType:{ type: String, enum: ['DIPLOMA', 'TRANSCRIPT', 'ENROLLMENT_VERIFICATION', 'SCHOLARSHIP_AWARD'], required: true },
  issueDate:      { type: Date, default: Date.now },
  fileUrl:        { type: String, required: true },
  digitalSignature: { type: String, required: true }, // Hashed cryptographic proof
  verificationToken: { type: String, required: true, unique: true }, // For QR public lookups
}, { timestamps: true });


module.exports = mongoose.model('IssuedCertificate', issuedCertificateSchema);
