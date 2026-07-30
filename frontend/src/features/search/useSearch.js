import { useQuery } from '@tanstack/react-query';
import { searchClient } from '@/api/searchClient';

export const useSearch = (params = {}) =>
  useQuery({
    queryKey: ['search', params],
    queryFn: () => searchClient.search(params),
    enabled: !!(params.q && params.q.trim().length > 1),
    keepPreviousData: true,
  });
