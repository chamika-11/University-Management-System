import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradingClient } from '@/api/gradingClient';

export const useMyGrades = () =>
  useQuery({
    queryKey: ['grades', 'mine'],
    queryFn: gradingClient.getMyGrades,
  });

export const useMyTranscript = () =>
  useQuery({
    queryKey: ['grades', 'transcript'],
    queryFn: gradingClient.getMyTranscript,
  });

export const useMyAppeals = () =>
  useQuery({
    queryKey: ['grades', 'appeals', 'mine'],
    queryFn: gradingClient.getMyAppeals,
  });

export const useFileAppeal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: gradingClient.fileAppeal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['grades', 'appeals', 'mine'] }),
  });
};
