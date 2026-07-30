import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeClient } from '@/api/financeClient';

export const useMyInvoices = () =>
  useQuery({
    queryKey: ['finance', 'invoices', 'mine'],
    queryFn: financeClient.getMyInvoices,
  });

export const useInvoice = (id) =>
  useQuery({
    queryKey: ['finance', 'invoice', id],
    queryFn: () => financeClient.getInvoice(id),
    enabled: !!id,
  });

export const useMyBalance = () =>
  useQuery({
    queryKey: ['finance', 'balance'],
    queryFn: financeClient.getBalance,
  });

export const useProcessPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: financeClient.processPayment,
    onSuccess: (data) => {
      // Optimistically update balance then confirm from server
      qc.invalidateQueries({ queryKey: ['finance', 'invoices', 'mine'] });
      qc.invalidateQueries({ queryKey: ['finance', 'balance'] });
      qc.invalidateQueries({ queryKey: ['bff', 'student', 'dashboard'] });
    },
  });
};
