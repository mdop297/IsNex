import { coreApi } from '@/lib/api';
import { DocumentResponse } from '@/lib/generated/core/data-contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { id } from 'zod/v4/locales';

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-doc'],
    mutationFn: async (id: string) => {
      await coreApi.deleteDocument(id);
    },

    onMutate: async (id: string) => {
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
        old.filter((d) => d.id !== id),
      );
      queryClient.setQueryData(['doc', id], undefined);

      return { previousDocs, previousDoc };
    },
    onError: (_, __, context) => {
      if (context?.previousDocs)
        queryClient.setQueryData(['docs'], context.previousDocs);
      if (context?.previousDoc)
        queryClient.setQueryData(['doc', id], context.previousDoc);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['docs'] });
      queryClient.invalidateQueries({ queryKey: ['doc', id] });
    },
  });
};
