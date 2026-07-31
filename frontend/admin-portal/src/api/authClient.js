import { axiosInstance } from './axiosInstance';

export const authClient = {
  login: (payload) => axiosInstance.post('/api/v1/auth/login', payload),
  refresh: (payload) => axiosInstance.post('/api/v1/auth/refresh', payload),
  me: () => axiosInstance.get('/api/v1/auth/me'),
  register: (payload) => axiosInstance.post('/api/v1/auth/register', payload),
};