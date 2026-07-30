import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryClient } from '@/api/libraryClient';

export const useBookSearch = (params = {}) =>
  useQuery({
    queryKey: ['library', 'books', params],
    queryFn: () => libraryClient.searchBooks(params),
    keepPreviousData: true,
  });

export const useMyLoans = () =>
  useQuery({
    queryKey: ['library', 'loans', 'mine'],
    queryFn: libraryClient.getMyLoans,
  });

export const useCheckout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: libraryClient.checkout,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['library', 'loans', 'mine'] });
      qc.invalidateQueries({ queryKey: ['library', 'books'] });
    },
  });
};

export const useRenewLoan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: libraryClient.renewLoan,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['library', 'loans', 'mine'] }),
  });
};
