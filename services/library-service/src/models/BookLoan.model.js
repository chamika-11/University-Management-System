'use strict';

const mongoose = require('mongoose');

const bookLoanSchema = new mongoose.Schema({
  bookId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  studentId:  { type: String, required: true, index: true }, // userId
  loanDate:   { type: Date, default: Date.now },
  dueDate:    { type: Date, required: true },
  returnDate: { type: Date, default: null },
  status:     { type: String, enum: ['ISSUED', 'RETURNED', 'OVERDUE'], default: 'ISSUED' },
  renewCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('BookLoan', bookLoanSchema);
