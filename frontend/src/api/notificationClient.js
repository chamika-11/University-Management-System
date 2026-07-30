import api from '@/api/axiosInstance';

export const notificationClient = {
  getMyNotifications: (params = {}) =>
    api.get('/api/v1/notifications/', { params }).then((r) => r.data),

  getPreferences: () =>
    api.get('/api/v1/notifications/preferences').then((r) => r.data),

  updatePreferences: (payload) =>
    api.put('/api/v1/notifications/preferences', payload).then((r) => r.data),
};
