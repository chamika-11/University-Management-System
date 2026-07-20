'use strict';

const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true, trim: true },
  code:        { type: String, required: true, unique: true, uppercase: true, trim: true },
  dean:        { type: String, trim: true, default: '' },
  description: { type: String, default: '' },
  established: { type: Number },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

collegeSchema.index({ code: 1 }, { unique: true });
module.exports = mongoose.model('College', collegeSchema);
