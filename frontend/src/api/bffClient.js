import api from '@/api/axiosInstance';

export const bffClient = {
  getStudentDashboard: () =>
    api.get('/api/v1/bff/student/dashboard').then((r) => r.data),
};
