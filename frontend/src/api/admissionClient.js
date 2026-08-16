import { axiosInstance } from './axiosInstance';

export const admissionClient = {
  applications: (params) => axiosInstance.get('/api/v1/admissions/applications', { params }),
  evaluate: (id, payload) => axiosInstance.post(`/api/v1/admissions/applications/${id}/evaluate`, payload),
  offer: (id, payload) => axiosInstance.post(`/api/v1/admissions/applications/${id}/offer`, payload),
  confirm: (id, payload) => axiosInstance.post(`/api/v1/admissions/applications/${id}/confirm`, payload),
  cycles: () => axiosInstance.get('/api/v1/admissions/cycles'),
  createCycle: (payload) => axiosInstance.post('/api/v1/admissions/cycles', payload),
};