import { useQuery } from '@tanstack/react-query';
import { bffClient } from '../../api/bffClient';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['bff', 'admin', 'dashboard'],
    queryFn: async () => (await bffClient.adminDashboard()).data,
  });
}