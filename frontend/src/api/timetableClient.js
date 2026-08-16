import { axiosInstance } from './axiosInstance';

export const timetableClient = {
  schedules: (semesterId) => axiosInstance.get(`/api/v1/timetable/schedules/semester/${semesterId}`),
  timeslots: () => axiosInstance.get('/api/v1/timetable/timeslots'),
  classrooms: () => axiosInstance.get('/api/v1/timetable/classrooms'),
  holidays: () => axiosInstance.get('/api/v1/timetable/holidays'),
  cancelClass: (id, payload) => axiosInstance.post(`/api/v1/timetable/schedules/${id}/cancel`, payload),
};