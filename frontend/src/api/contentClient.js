import api from '@/api/axiosInstance';

export const contentClient = {
  getModules: (params = {}) =>
    api.get('/api/v1/content/modules', { params }).then((r) => r.data),

  getLessons: (moduleId) =>
    api.get(`/api/v1/content/modules/${moduleId}/lessons`).then((r) => r.data),

  getLiveSessions: (sectionId) =>
    api.get(`/api/v1/live-classes/sections/${sectionId}/livesessions`).then((r) => r.data),
};
