import api from '@/api/axiosInstance';

export const userClient = {
  getMyProfile: () =>
    api.get('/api/v1/users/profile/me').then((r) => r.data),

  updateMyProfile: (payload) =>
    api.put('/api/v1/users/profile/me', payload).then((r) => r.data),

  getAddresses: () =>
    api.get('/api/v1/users/addresses').then((r) => r.data),

  addAddress: (payload) =>
    api.post('/api/v1/users/addresses', payload).then((r) => r.data),

  updateAddress: (id, payload) =>
    api.put(`/api/v1/users/addresses/${id}`, payload).then((r) => r.data),

  getEmergencyContacts: () =>
    api.get('/api/v1/users/emergency-contacts').then((r) => r.data),

  addEmergencyContact: (payload) =>
    api.post('/api/v1/users/emergency-contacts', payload).then((r) => r.data),

  // Admin Management Endpoints
  getUsers: (params) =>
    api.get('/api/v1/users', { params }).then((r) => r.data),

  createUser: (payload) =>
    api.post('/api/v1/auth/register', payload).then((r) => r.data),

  lockUser: (id, durationMinutes = 60) =>
    api.post(`/api/v1/users/${id}/lock`, { durationMinutes }).then((r) => r.data),

  unlockUser: (id) =>
    api.post(`/api/v1/users/${id}/unlock`).then((r) => r.data),

  updateUserStatus: (id, status) =>
    api.patch(`/api/v1/users/${id}`, { status }).then((r) => r.data),

  deleteUser: (id) =>
    api.delete(`/api/v1/users/${id}`).then((r) => r.data),
};
