import { coreApi } from '@/lib/api';
import {
  DocumentResponse,
  DocumentUpdate,
} from '@/lib/generated/core/data-contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-doc'],
    mutationFn: async ({ id, data }: { id: string; data: DocumentUpdate }) => {
      await coreApi.updateDocument(id, data);
    },
    onMutate: async ({ id, data }: { id: string; data: DocumentUpdate }) => {
      await queryClient.cancelQueries({ queryKey: ['docs'] });
      await queryClient.cancelQueries({ queryKey: ['doc', id] });

      const previousDocs = queryClient.getQueryData<DocumentResponse[]>([
        'docs',
      ]);
      const previousDoc = queryClient.getQueryData<DocumentResponse>([
        'doc',
        id,
      ]);

      queryClient.setQueryData(['docs'], (old: DocumentResponse[] = []) =>
        old.map((d) => (d.id === id ? { ...d, ...data } : d)),
      );

      queryClient.setQueryData(['doc', id], (old?: DocumentResponse) => ({
        ...old,
        ...data,
      }));
      return { previousDocs, previousDoc };
    },

    // Rollback in case of failure
    onError: (_, __, ctx) => {
      if (ctx?.previousDocs)
        queryClient.setQueryData(['docs'], ctx.previousDocs);
      if (ctx?.previousDoc)
        queryClient.setQueryData(['doc', ctx.previousDoc.id], ctx.previousDoc);
    },

    // Ensure final backend sync
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['docs'] });
      queryClient.invalidateQueries({ queryKey: ['doc', id] });
    },
  });
};
