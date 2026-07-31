import { useQuery } from '@tanstack/react-query';
import { admissionClient } from '../../api/admissionClient';

export function useApplications(filters) {
  return useQuery({
    queryKey: ['admissions', 'applications', filters || {}],
    queryFn: async () => (await admissionClient.applications(filters)).data,
  });
}