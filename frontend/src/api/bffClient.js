import { axiosInstance } from './axiosInstance';

export const bffClient = {
  adminDashboard: () => axiosInstance.get('/api/v1/bff/admin/dashboard'),
};