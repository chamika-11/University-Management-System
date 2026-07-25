'use strict';

const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  code:       { type: String, required: true, unique: true, uppercase: true, trim: true },
  collegeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, index: true },
  hodId:      { type: String, default: null }, // userId from user-service
  description:{ type: String, default: '' },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

departmentSchema.index({ code: 1 }, { unique: true });
departmentSchema.index({ collegeId: 1 });
module.exports = mongoose.model('Department', departmentSchema);
