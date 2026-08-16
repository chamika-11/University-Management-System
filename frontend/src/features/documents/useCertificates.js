import { useQuery } from '@tanstack/react-query';
import { documentClient } from '../../api/documentClient';

export function useCertificates(studentId) {
  return useQuery({
    queryKey: ['documents', 'certificates', studentId],
    queryFn: async () => (await documentClient.certificatesByStudent(studentId)).data,
    enabled: Boolean(studentId),
  });
}