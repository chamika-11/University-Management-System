import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

const baseURL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});