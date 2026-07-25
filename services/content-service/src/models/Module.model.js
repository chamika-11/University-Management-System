'use strict';

const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  courseId:    { type: String, required: true, index: true }, // reference to Course in academic-service
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  order:       { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
