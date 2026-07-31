import { useQuery } from '@tanstack/react-query';
import { searchClient } from '../../api/searchClient';

export function useSearch(params) {
  return useQuery({
    queryKey: ['search', params || {}],
    queryFn: async () => (await searchClient.search(params)).data,
  });
}