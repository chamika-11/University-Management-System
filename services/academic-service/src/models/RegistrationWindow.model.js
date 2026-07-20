'use strict';

const mongoose = require('mongoose');

const registrationWindowSchema = new mongoose.Schema({
  semesterId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true, index: true },
  openDate:        { type: Date, required: true },
  closeDate:       { type: Date, required: true },
  type:            { type: String, enum: ['REGULAR', 'LATE', 'ADD_DROP'], default: 'REGULAR' },
  eligibleGroups:  [{ type: String }], // e.g. ['STUDENT', 'year:2', 'program:CS']
  isActive:        { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('RegistrationWindow', registrationWindowSchema);
