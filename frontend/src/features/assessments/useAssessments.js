import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentClient } from '@/api/assessmentClient';

export const useMyAssessments = (params = {}) =>
  useQuery({
    queryKey: ['assessments', 'mine', params],
    queryFn: () => assessmentClient.getMyAssessments(params),
  });

export const useSubmitAssignment = (params = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => assessmentClient.submitAssignment(id, formData),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['assessments', 'mine', params] }),
  });
};
