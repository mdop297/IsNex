import { coreApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const useDocuments = () =>
  useQuery({
    queryKey: ['docs'],
    queryFn: async () => {
      const res = await coreApi.getDocumentsByFolderId();
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.data;
    },
    staleTime: 60_000 * 30,
  });
