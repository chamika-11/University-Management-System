'use strict';

const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  departmentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
  degreeType:    { type: String, enum: ['BACHELOR', 'MASTER', 'DOCTORATE', 'DIPLOMA', 'CERTIFICATE'], required: true },
  durationYears: { type: Number, required: true, min: 1, max: 10 },
  totalCredits:  { type: Number, required: true, min: 1 },
  description:   { type: String, default: '' },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });


module.exports = mongoose.model('Program', programSchema);
