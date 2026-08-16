import { axiosInstance } from './axiosInstance';

export const financeClient = {
  invoices: (params) => axiosInstance.get('/api/v1/finance/invoices', { params }),
  invoiceById: (id) => axiosInstance.get(`/api/v1/finance/invoices/${id}`),
  ledgerBalance: (userId) => axiosInstance.get(`/api/v1/finance/ledger/balance/${userId}`),
};