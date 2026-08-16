import { axiosInstance } from './axiosInstance';

export const userClient = {
  list: (params) => axiosInstance.get('/api/v1/users', { params }),
  byId: (id) => axiosInstance.get(`/api/v1/users/${id}`),
  update: (id, payload) => axiosInstance.patch(`/api/v1/users/${id}`, payload),
  remove: (id) => axiosInstance.delete(`/api/v1/users/${id}`),
  lock: (id) => axiosInstance.post(`/api/v1/users/${id}/lock`),
  unlock: (id) => axiosInstance.post(`/api/v1/users/${id}/unlock`),
  roles: () => axiosInstance.get('/api/v1/users/roles'),
};