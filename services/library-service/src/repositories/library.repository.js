'use strict';

const Book = require('../models/Book.model');
const BookLoan = require('../models/BookLoan.model');
const Fine = require('../models/Fine.model');
const paginate = require('../utils/paginate');

class LibraryRepository {
  async createBook(data) { return Book.create(data); }
  async findBookById(id) { return Book.findById(id); }
  async findBookByIsbn(isbn) { return Book.findOne({ isbn: isbn.toUpperCase() }); }
  async searchBooks(filter = {}, options = {}) { return paginate(Book, filter, options); }
  async updateBookCopies(id, total, available) { return Book.findByIdAndUpdate(id, { $set: { totalCopies: total, availableCopies: available } }, { new: true }); }
  async decrementAvailableCopies(id) { return Book.findByIdAndUpdate(id, { $inc: { availableCopies: -1 } }, { new: true }); }
  async incrementAvailableCopies(id) { return Book.findByIdAndUpdate(id, { $inc: { availableCopies: 1 } }, { new: true }); }

  async createLoan(data) { return BookLoan.create(data); }
  async findLoanById(id) { return BookLoan.findById(id).populate('bookId'); }
  async findActiveLoansByStudent(studentId) { return BookLoan.find({ studentId, status: 'ISSUED' }).populate('bookId'); }
  async findLoans(filter = {}, options = {}) { return paginate(BookLoan, filter, { ...options, populate: 'bookId' }); }

  async createFine(data) { return Fine.create(data); }
  async findFineByLoanId(loanId) { return Fine.findOne({ loanId }); }
  async updateFinePaid(fineInvoiceId) { return Fine.findOneAndUpdate({ fineInvoiceId }, { $set: { status: 'PAID' } }, { new: true }); }
}

module.exports = new LibraryRepository();
