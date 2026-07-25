'use strict';

const mongoose = require('mongoose');

const hallTicketSchema = new mongoose.Schema({
  studentId:      { type: String, required: true, index: true },
  semesterId:     { type: String, required: true },
  ticketCode:     { type: String, required: true, unique: true },
  exams: [{
    examScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamSchedule', required: true },
    seatNumber:     { type: String, required: true },
  }],
  isApproved:     { type: Boolean, default: false },
}, { timestamps: true });

hallTicketSchema.index({ studentId: 1, semesterId: 1 }, { unique: true });
module.exports = mongoose.model('HallTicket', hallTicketSchema);
