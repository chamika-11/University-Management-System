'use strict';

const mongoose = require('mongoose');

const indexedDocumentSchema = new mongoose.Schema({
  entityId:    { type: String, required: true, unique: true, index: true },
  entityType:  { type: String, enum: ['COURSE', 'FACULTY', 'STUDENT', 'LIBRARY_BOOK', 'FORUM_POST'], required: true, index: true },
  title:       { type: String, required: true, trim: true },
  content:     { type: String, default: '' },
  category:    { type: String, default: '' },
  metadata:    { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

indexedDocumentSchema.index({ entityId: 1 }, { unique: true });
indexedDocumentSchema.index({ title: 'text', content: 'text', category: 'text' });
module.exports = mongoose.model('IndexedDocument', indexedDocumentSchema);
