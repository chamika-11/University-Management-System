import { useQuery } from '@tanstack/react-query';
import { academicClient } from '../../api/academicClient';

export function useCourses(filters) {
  return useQuery({
    queryKey: ['academics', 'courses', filters || {}],
    queryFn: async () => (await academicClient.courses(filters)).data,
  });
}