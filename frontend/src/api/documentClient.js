import { axiosInstance } from './axiosInstance';

export const documentClient = {
  upload: (payload) => axiosInstance.post('/api/v1/documents/upload', payload),
  issueCertificate: (payload) => axiosInstance.post('/api/v1/documents/certificates/issue', payload),
  certificatesByStudent: (studentId) => axiosInstance.get(`/api/v1/documents/certificates/student/${studentId}`),
  fileById: (id) => axiosInstance.get(`/api/v1/documents/files/${id}`),
  deleteFile: (id) => axiosInstance.delete(`/api/v1/documents/files/${id}`),
};