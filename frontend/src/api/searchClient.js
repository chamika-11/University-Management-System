import api from '@/api/axiosInstance';

export const searchClient = {
  search: (params = {}) =>
    api.get('/api/v1/search/', { params }).then((r) => r.data),
};
