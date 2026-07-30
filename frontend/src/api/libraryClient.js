import api from '@/api/axiosInstance';

export const libraryClient = {
  searchBooks: (params = {}) =>
    api.get('/api/v1/library/books', { params }).then((r) => r.data),

  getMyLoans: () =>
    api.get('/api/v1/library/loans/me').then((r) => r.data),

  checkout: (bookId) =>
    api.post('/api/v1/library/checkout', { bookId }).then((r) => r.data),

  renewLoan: (loanId) =>
    api.post(`/api/v1/library/loans/${loanId}/renew`).then((r) => r.data),
};
