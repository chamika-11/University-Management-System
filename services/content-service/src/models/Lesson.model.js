'use strict';

const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  moduleId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
  title:       { type: String, required: true, trim: true },
  content:     { type: String, default: '' }, // Markdown or text content
  contentType: { type: String, enum: ['TEXT', 'VIDEO', 'DOCUMENT', 'QUIZ'], default: 'TEXT' },
  fileUrl:     { type: String, default: null }, // from document-service
  durationMin: { type: Number, default: 0 },
  order:       { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
