import api from '@/api/axiosInstance';

export const academicClient = {
  getCourses: (params = {}) =>
    api.get('/api/v1/academics/courses', { params }).then((r) => r.data),

  getCourse: (id) =>
    api.get(`/api/v1/academics/courses/${id}`).then((r) => r.data),

  getSyllabus: (courseId) =>
    api.get(`/api/v1/academics/courses/${courseId}/syllabus`).then((r) => r.data),

  getPrerequisites: (courseId) =>
    api.get(`/api/v1/academics/courses/${courseId}/prerequisites`).then((r) => r.data),

  getDepartments: () =>
    api.get('/api/v1/academics/departments').then((r) => r.data),

  getPrograms: () =>
    api.get('/api/v1/academics/programs').then((r) => r.data),

  getCurrentSemester: () =>
    api.get('/api/v1/academics/semesters/current').then((r) => r.data),
};
