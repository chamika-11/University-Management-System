'use strict';

const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  slug:      { type: String, required: true, unique: true, trim: true, lowercase: true }, // e.g. 'welcome-student'
  name:      { type: String, required: true },
  channel:   { type: String, enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'], required: true },
  subject:   { type: String, default: '' }, // for EMAIL
  bodyHtml:  { type: String, default: '' }, // Handlebars template
  bodyText:  { type: String, default: '' }, // Plain text fallback
  variables: [{ name: String, description: String, required: Boolean }], // Documentation
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });


module.exports = mongoose.model('NotificationTemplate', templateSchema);
