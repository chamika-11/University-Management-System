import { useQuery } from '@tanstack/react-query';
import { timetableClient } from '@/api/timetableClient';

export const useMySchedule = (sectionId) =>
  useQuery({
    queryKey: ['timetable', 'schedule', sectionId],
    queryFn: () => timetableClient.getSchedule(sectionId),
    enabled: !!sectionId,
  });

export const useMyAttendance = () =>
  useQuery({
    queryKey: ['attendance', 'mine'],
    queryFn: timetableClient.getMyAttendance,
  });
