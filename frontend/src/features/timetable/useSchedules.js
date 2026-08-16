import { useQuery } from '@tanstack/react-query';
import { timetableClient } from '../../api/timetableClient';

export function useSchedules(semesterId) {
  return useQuery({
    queryKey: ['timetable', 'schedules', semesterId],
    queryFn: async () => (await timetableClient.schedules(semesterId)).data,
    enabled: Boolean(semesterId),
  });
}