import { useQuery } from '@tanstack/react-query';
import { userClient } from '../../api/userClient';

export function useUsers(params) {
  return useQuery({
    queryKey: ['users', params || {}],
    queryFn: async () => (await userClient.list(params)).data,
  });
}