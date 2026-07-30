import api from '@/api/axiosInstance';

export const assessmentClient = {
  getMyAssessments: (params = {}) =>
    api.get('/api/v1/assessments/', { params }).then((r) => r.data),

  submitAssignment: (id, formData) =>
    api.post(`/api/v1/assessments/${id}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
};
