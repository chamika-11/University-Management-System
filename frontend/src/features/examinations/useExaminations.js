import { useQuery } from '@tanstack/react-query';
import { examinationClient } from '@/api/examinationClient';

export const useMyExamSchedules = () =>
  useQuery({
    queryKey: ['examinations', 'schedules', 'mine'],
    queryFn: examinationClient.getMySchedules,
  });

export const useMyTicket = () =>
  useQuery({
    queryKey: ['examinations', 'ticket'],
    queryFn: examinationClient.getMyTicket,
  });
