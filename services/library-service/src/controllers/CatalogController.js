'use strict';

const libraryService = require('../services/IssueReturnService');
const libraryRepo = require('../repositories/library.repository');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

class CatalogController {
  addBook = asyncHandler(async (req, res) => {
    const book = await libraryRepo.createBook(req.body);
    res.status(201).json({ success: true, data: { book } });
  });

  search = asyncHandler(async (req, res) => {
    const { page, limit, category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$text = { $search: search };
    }
    const result = await libraryRepo.searchBooks(filter, { page, limit });
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  });

  checkout = asyncHandler(async (req, res) => {
    const studentId = req.user.id;
    const loan = await libraryService.checkoutBook({ studentId, isbn: req.body.isbn });
    res.status(201).json({ success: true, data: { loan } });
  });

  return = asyncHandler(async (req, res) => {
    const result = await libraryService.returnBook(req.params.loanId);
    res.status(200).json({ success: true, data: result });
  });

  renew = asyncHandler(async (req, res) => {
    const loan = await libraryService.renewBook(req.params.loanId);
    res.status(200).json({ success: true, data: { loan } });
  });

  getStudentLoans = asyncHandler(async (req, res) => {
    const studentId = req.params.studentId || req.user.id;
    const list = await libraryRepo.findActiveLoansByStudent(studentId);
    res.status(200).json({ success: true, data: { loans: list } });
  });
}

module.exports = new CatalogController();
