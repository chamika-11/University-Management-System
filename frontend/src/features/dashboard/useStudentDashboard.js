import { useQuery } from '@tanstack/react-query';
import { bffClient } from '@/api/bffClient';

export const useStudentDashboard = () =>
  useQuery({
    queryKey: ['bff', 'student', 'dashboard'],
    queryFn: bffClient.getStudentDashboard,
  });
