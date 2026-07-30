import api from '@/api/axiosInstance';

export const admissionClient = {
  getMyApplication: (id) =>
    api.get(`/api/v1/admissions/applications/${id}`).then((r) => r.data),

  acceptOffer: (id) =>
    api.post(`/api/v1/admissions/applications/${id}/accept`).then((r) => r.data),
};
