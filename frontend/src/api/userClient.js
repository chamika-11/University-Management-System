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
};
