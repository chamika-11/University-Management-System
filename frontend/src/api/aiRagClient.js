import api from '@/api/axiosInstance';

export const aiRagClient = {
  chat: (payload) =>
    api.post('/api/v1/ai/chat/', payload).then((r) => r.data),
};
