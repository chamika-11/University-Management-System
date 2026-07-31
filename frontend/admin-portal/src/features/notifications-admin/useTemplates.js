import { useQuery } from '@tanstack/react-query';
import { notificationClient } from '../../api/notificationClient';

export function useTemplates() {
  return useQuery({
    queryKey: ['notifications', 'templates'],
    queryFn: async () => (await notificationClient.templates()).data,
  });
}