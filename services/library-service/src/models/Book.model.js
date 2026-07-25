'use strict';

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  author:    { type: String, required: true, trim: true },
  isbn:      { type: String, required: true, unique: true, uppercase: true, trim: true },
  category:  { type: String, trim: true, default: 'General' },
  totalCopies: { type: Number, required: true, min: 1 },
  availableCopies: { type: Number, required: true, min: 0 },
  shelfLocation: { type: String, trim: true, default: 'TBD' },
}, { timestamps: true });

bookSchema.index({ isbn: 1 }, { unique: true });
bookSchema.index({ title: 'text', author: 'text' });
module.exports = mongoose.model('Book', bookSchema);
