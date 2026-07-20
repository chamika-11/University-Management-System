'use strict';

const mongoose = require('mongoose');

const admissionCycleSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true }, // e.g. "Fall 2026 Intake"
  code:        { type: String, required: true, unique: true, uppercase: true, trim: true }, // e.g. "FALL-2026"
  startDate:   { type: Date, required: true },
  endDate:     { type: Date, required: true },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

admissionCycleSchema.index({ code: 1 }, { unique: true });
module.exports = mongoose.model('AdmissionCycle', admissionCycleSchema);
