import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionClient } from '@/api/admissionClient';

export const useMyApplication = (applicationId) =>
  useQuery({
    queryKey: ['admissions', 'myApplication', applicationId],
    queryFn: () => admissionClient.getMyApplication(applicationId),
    enabled: !!applicationId,
  });

export const useAcceptOffer = (applicationId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => admissionClient.acceptOffer(applicationId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['admissions', 'myApplication', applicationId] }),
  });
};
