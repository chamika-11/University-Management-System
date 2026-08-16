import { useQuery } from '@tanstack/react-query';
import { reportingClient } from '../../api/reportingClient';

export function useAcademicReports() {
  return useQuery({
    queryKey: ['reports', 'academic'],
    queryFn: async () => (await reportingClient.academicReports()).data,
  });
}