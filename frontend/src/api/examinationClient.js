import api from '@/api/axiosInstance';

export const examinationClient = {
  getMySchedules: () =>
    api.get('/api/v1/examinations/schedules').then((r) => r.data),

  getMyTicket: () =>
    api.get('/api/v1/examinations/tickets').then((r) => r.data),
};
