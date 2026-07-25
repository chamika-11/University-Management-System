'use strict';

const libraryRepo = require('../repositories/library.repository');
const publisher = require('../events/publisher');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class IssueReturnService {
  /**
   * Issues/checks out a book copy to a student.
   */
  async checkoutBook({ studentId, isbn }) {
    const book = await libraryRepo.findBookByIsbn(isbn);
    if (!book) throw AppError.notFound('Book');
    if (book.availableCopies <= 0) throw AppError.conflict('No available copies of this book currently', 'NO_COPIES_AVAILABLE');

    // Check if student already has active loan for this book
    const active = await libraryRepo.findActiveLoansByStudent(studentId);
    if (active.some(loan => loan.bookId.isbn === isbn.toUpperCase())) {
      throw AppError.conflict('You already have an active loan for this book', 'DUPLICATE_LOAN');
    }

    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days loan period
    const loan = await libraryRepo.createLoan({
      bookId: book._id,
      studentId,
      dueDate,
      status: 'ISSUED',
    });

    await libraryRepo.decrementAvailableCopies(book._id);

    await publisher.publish('library.events', {
      eventType: 'library.book_issued',
      payload: { loanId: loan._id.toString(), studentId, title: book.title, dueDate },
    });

    logger.info('[LibraryService] Book checked out', { studentId, title: book.title });
    return loan;
  }

  /**
   * Returns a checked-out book copy. Calculates fine if overdue.
   */
  async returnBook(loanId) {
    const loan = await libraryRepo.findLoanById(loanId);
    if (!loan || loan.status === 'RETURNED') throw AppError.badRequest('Invalid loan or book already returned', 'INVALID_LOAN');

    loan.returnDate = new Date();
    loan.status = 'RETURNED';
    await loan.save();

    await libraryRepo.incrementAvailableCopies(loan.bookId._id);

    // Calculate overdue fine if returned past due date (e.g. $2 per day)
    if (loan.returnDate > loan.dueDate) {
      const diffTime = Math.abs(loan.returnDate - loan.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const fineAmount = diffDays * 2.0;

      const fine = await libraryRepo.createFine({
        loanId,
        studentId: loan.studentId,
        amount: fineAmount,
        status: 'UNPAID',
      });

      // Notify finance service about fine creation to generate invoice
      await publisher.publish('library.events', {
        eventType: 'library.overdue_fine_invoiced',
        payload: { fineId: fine._id.toString(), studentId: loan.studentId, amount: fineAmount },
      });

      logger.info('[LibraryService] Overdue book fine recorded', { studentId: loan.studentId, fineAmount });
      return { loan, fine };
    }

    return { loan };
  }

  async renewBook(loanId) {
    const loan = await libraryRepo.findLoanById(loanId);
    if (!loan || loan.status !== 'ISSUED') throw AppError.badRequest('Loan is not active', 'INVALID_LOAN');
    if (loan.renewCount >= 2) throw AppError.badRequest('Maximum renewal limit reached', 'RENEW_LIMIT_EXCEEDED');

    loan.dueDate = new Date(loan.dueDate.getTime() + 7 * 24 * 60 * 60 * 1000); // add 7 days
    loan.renewCount += 1;
    await loan.save();

    return loan;
  }
}

module.exports = new IssueReturnService();
