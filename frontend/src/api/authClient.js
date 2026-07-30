import axiosInstance from './axiosInstance';

export const authClient = {
  login: async (credentials) => {
    const res = await axiosInstance.post('/api/v1/auth/login', credentials);
    return res.data;
  },

  logout: async (refreshToken = null) => {
    const res = await axiosInstance.post('/api/v1/auth/logout', { refreshToken });
    return res.data;
  },

  getSession: async () => {
    try {
      const res = await axiosInstance.get('/api/v1/auth/session');
      return res.data;
    } catch {
      // Fallback to /auth/me if /auth/session not yet available on gateway
      const res = await axiosInstance.get('/api/v1/auth/me');
      return res.data;
    }
  },

  refresh: async () => {
    const res = await axiosInstance.post('/api/v1/auth/refresh');
    return res.data;
  },
};
