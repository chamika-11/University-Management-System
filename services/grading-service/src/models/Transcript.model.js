'use strict';

const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  studentId:   { type: String, required: true, unique: true, index: true },
  gpaRecords: [{
    semesterId: { type: String, required: true },
    sgpa:       { type: Number, required: true, min: 0, max: 10 },
    creditsEarned: { type: Number, required: true },
  }],
  cgpa:          { type: Number, default: 0, min: 0, max: 10 },
  totalCredits:  { type: Number, default: 0 },
  isVerified:    { type: Boolean, default: false },
}, { timestamps: true });


module.exports = mongoose.model('Transcript', transcriptSchema);
