import api from '@/api/axiosInstance';

export const enrollmentClient = {
  getMyEnrollments: () =>
    api.get('/api/v1/enrollments/').then((r) => r.data),

  enroll: (sectionId) =>
    api.post('/api/v1/enrollments/', { sectionId }).then((r) => r.data),

  drop: (enrollmentId) =>
    api.delete(`/api/v1/enrollments/${enrollmentId}`).then((r) => r.data),

  getMyWaitlists: () =>
    api.get('/api/v1/enrollments/waitlist').then((r) => r.data),

  joinWaitlist: (sectionId) =>
    api.post(`/api/v1/enrollments/waitlist/${sectionId}`).then((r) => r.data),

  leaveWaitlist: (sectionId) =>
    api.delete(`/api/v1/enrollments/waitlist/${sectionId}`).then((r) => r.data),
};
