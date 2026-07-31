import { useQuery } from '@tanstack/react-query';
import { financeClient } from '../../api/financeClient';

export function useInvoices(filters) {
  return useQuery({
    queryKey: ['finance', 'invoices', filters || {}],
    queryFn: async () => (await financeClient.invoices(filters)).data,
  });
}