import api from '@/api/axiosInstance';

export const forumClient = {
  getPosts: (params = {}) =>
    api.get('/api/v1/forums/posts', { params }).then((r) => r.data),

  getPost: (id) =>
    api.get(`/api/v1/forums/posts/${id}`).then((r) => r.data),

  createPost: (payload) =>
    api.post('/api/v1/forums/posts', payload).then((r) => r.data),

  getComments: (postId) =>
    api.get(`/api/v1/forums/posts/${postId}/comments`).then((r) => r.data),

  createComment: (postId, payload) =>
    api.post(`/api/v1/forums/posts/${postId}/comments`, payload).then((r) => r.data),

  upvote: (postId) =>
    api.post(`/api/v1/forums/posts/${postId}/upvote`).then((r) => r.data),
};
