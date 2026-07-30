import api from '@/api/axiosInstance';

export const gradingClient = {
  getMyGrades: () =>
    api.get('/api/v1/grades/grades').then((r) => r.data),

  getMyTranscript: () =>
    api.get('/api/v1/grades/transcript').then((r) => r.data),

  fileAppeal: (payload) =>
    api.post('/api/v1/grades/appeals', payload).then((r) => r.data),

  getMyAppeals: () =>
    api.get('/api/v1/grades/appeals').then((r) => r.data),
};
