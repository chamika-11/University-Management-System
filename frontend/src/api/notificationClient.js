import { axiosInstance } from './axiosInstance';

export const notificationClient = {
  templates: () => axiosInstance.get('/api/v1/notifications/templates'),
  createTemplate: (payload) => axiosInstance.post('/api/v1/notifications/templates', payload),
  updateTemplate: (id, payload) => axiosInstance.patch(`/api/v1/notifications/templates/${id}`, payload),
  send: (payload) => axiosInstance.post('/api/v1/notifications/send', payload),
};