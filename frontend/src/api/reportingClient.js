import { axiosInstance } from './axiosInstance';

export const reportingClient = {
  generateAcademic: (payload) => axiosInstance.post('/api/v1/reports/academic', payload),
  academicReports: () => axiosInstance.get('/api/v1/reports/academic'),
  generateFinancial: (payload) => axiosInstance.post('/api/v1/reports/financial', payload),
  financialReports: () => axiosInstance.get('/api/v1/reports/financial'),
  auditTrail: () => axiosInstance.get('/api/v1/audit/audit'),
};