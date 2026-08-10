import api from '@/api/axiosInstance';

export const financeClient = {
  getMyInvoices: () =>
    api.get('/api/v1/finance/invoices/me').then((r) => r.data),

  getInvoice: (id) =>
    api.get(`/api/v1/finance/invoices/${id}`).then((r) => r.data),

  getBalance: () =>
    api.get('/api/v1/finance/ledger/balance').then((r) => r.data),

  processPayment: (payload) =>
    api.post('/api/v1/finance/payments/charge', payload).then((r) => r.data),

  getAllInvoices: (params = {}) =>
    api.get('/api/v1/finance/invoices', { params }).then((r) => r.data),
};
