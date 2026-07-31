import { axiosInstance } from './axiosInstance';

export const searchClient = {
  search: (params) => axiosInstance.get('/api/v1/search/', { params }),
  reindex: (payload) => axiosInstance.post('/api/v1/search/index', payload),
};