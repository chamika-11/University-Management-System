'use strict';

const mongoose = require('mongoose');

const fileMetadataSchema = new mongoose.Schema({
  filename:     { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType:     { type: String, required: true },
  sizeBytes:    { type: Number, required: true },
  path:         { type: String, required: true },
  sha256Hash:   { type: String, required: true },
  uploadedBy:   { type: String, required: true, index: true }, // userId
  isPublic:     { type: Boolean, default: false },
}, { timestamps: true });

fileMetadataSchema.index({ sha256Hash: 1 });
module.exports = mongoose.model('FileMetadata', fileMetadataSchema);
