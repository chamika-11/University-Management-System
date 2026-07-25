'use strict';

const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema({
  sectionId:    { type: String, required: true, index: true }, // references CourseSection in academic-service
  title:        { type: String, required: true, trim: true },
  description:  { type: String, default: '' },
  startTime:    { type: Date, required: true },
  endTime:      { type: Date, required: true },
  meetingLink:  { type: String, required: true },
  recordingUrl: { type: String, default: null },
  status:       { type: String, enum: ['SCHEDULED', 'LIVE', 'ENDED', 'CANCELLED'], default: 'SCHEDULED' },
  hostId:       { type: String, required: true }, // facultyId
}, { timestamps: true });

module.exports = mongoose.model('LiveSession', liveSessionSchema);
