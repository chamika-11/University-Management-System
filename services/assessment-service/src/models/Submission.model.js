'use strict';

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
  studentId:    { type: String, required: true, index: true }, // userId
  fileUrl:      { type: String, required: true }, // document-service link
  submittedAt:  { type: Date, default: Date.now },
  marksObtained:{ type: Number, default: null },
  feedback:     { type: String, default: '' },
  gradedBy:     { type: String, default: null }, // facultyId
  gradedAt:     { type: Date, default: null },
  status:       { type: String, enum: ['SUBMITTED', 'GRADED'], default: 'SUBMITTED' },
}, { timestamps: true });

submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
module.exports = mongoose.model('Submission', submissionSchema);
