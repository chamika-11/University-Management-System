import api from '@/api/axiosInstance';

export const timetableClient = {
  getSchedule: (sectionId) =>
    api.get(`/api/v1/timetable/schedules/section/${sectionId}`).then((r) => r.data),

  getMyAttendance: () =>
    api.get('/api/v1/attendance/me').then((r) => r.data),

  getCalendar: (params = {}) =>
    api.get('/api/v1/calendar/', { params }).then((r) => r.data),
};
