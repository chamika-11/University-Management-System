import api from '@/api/axiosInstance';

export const documentClient = {
  downloadFile: (id) =>
    api.get(`/api/v1/documents/files/${id}`, { responseType: 'blob' }).then((r) => r.data),

  getMyCertificates: () =>
    api.get('/api/v1/documents/certificates').then((r) => r.data),
};
