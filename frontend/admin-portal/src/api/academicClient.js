import { axiosInstance } from './axiosInstance';

export const academicClient = {
  colleges: () => axiosInstance.get('/api/v1/academics/colleges'),
  departments: () => axiosInstance.get('/api/v1/academics/departments'),
  programs: () => axiosInstance.get('/api/v1/academics/programs'),
  courses: (params) => axiosInstance.get('/api/v1/academics/courses', { params }),
  courseSyllabus: (id) => axiosInstance.get(`/api/v1/academics/courses/${id}/syllabus`),
  semesters: () => axiosInstance.get('/api/v1/academics/semesters'),
  sections: (semesterId) => axiosInstance.get(`/api/v1/academics/semesters/${semesterId}/sections`),
};