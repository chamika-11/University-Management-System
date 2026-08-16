import { useQuery } from '@tanstack/react-query';
import { userClient } from '../../api/userClient';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await userClient.roles()).data,
  });
}