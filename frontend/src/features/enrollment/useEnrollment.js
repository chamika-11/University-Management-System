import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentClient } from '@/api/enrollmentClient';

export const useMyEnrollments = () =>
  useQuery({
    queryKey: ['enrollments', 'mine'],
    queryFn: enrollmentClient.getMyEnrollments,
  });

export const useEnroll = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: enrollmentClient.enroll,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollments', 'mine'] });
      qc.invalidateQueries({ queryKey: ['academics', 'courses'] });
    },
  });
};

export const useDrop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: enrollmentClient.drop,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enrollments', 'mine'] }),
  });
};

export const useMyWaitlists = () =>
  useQuery({
    queryKey: ['enrollments', 'waitlist', 'mine'],
    queryFn: enrollmentClient.getMyWaitlists,
  });

export const useJoinWaitlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: enrollmentClient.joinWaitlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enrollments', 'waitlist', 'mine'] }),
  });
};

export const useLeaveWaitlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: enrollmentClient.leaveWaitlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enrollments', 'waitlist', 'mine'] }),
  });
};
