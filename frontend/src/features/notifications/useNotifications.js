import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationClient } from '@/api/notificationClient';

export const useMyNotifications = (page = 1) =>
  useQuery({
    queryKey: ['notifications', 'mine', { page }],
    queryFn: () => notificationClient.getMyNotifications({ page }),
    keepPreviousData: true,
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationClient.getMyNotifications({ unread: true }),
    refetchInterval: 30_000,
    select: (data) => {
      // Try to extract count from various response shapes
      if (typeof data?.count === 'number') return data.count;
      if (Array.isArray(data)) return data.filter((n) => !n.read).length;
      if (Array.isArray(data?.notifications)) return data.notifications.filter((n) => !n.read).length;
      return 0;
    },
  });

export const usePreferences = () =>
  useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: notificationClient.getPreferences,
  });

export const useUpdatePreferences = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationClient.updatePreferences,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications', 'preferences'] }),
  });
};
