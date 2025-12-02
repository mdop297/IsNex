import { coreApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const useDocuments = () =>
  useQuery({
    queryKey: ['docs'],
    queryFn: async () => {
      const res = await coreApi.getAllDocumentsByUser();
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.data;
    },
    staleTime: 60_000 * 30,
  });

export const useDocument = (fileId: string) =>
  useQuery({
    queryKey: ['doc', fileId],
    queryFn: async () => {
      const res = await coreApi.loadDocument(fileId);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      console.log(res.data);
      return res.data;
    },
  });
