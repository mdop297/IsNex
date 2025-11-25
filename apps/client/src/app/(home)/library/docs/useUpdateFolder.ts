import { coreApi } from '@/lib/api';
import {
  FolderResponse,
  FolderUpdate,
} from '@/lib/generated/core/data-contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-folder'],
    mutationFn: async ({ id, data }: { id: string; data: FolderUpdate }) => {
      await coreApi.updateFolder(id, data);
    },
    onMutate: async ({ id, data }: { id: string; data: FolderUpdate }) => {
      await queryClient.cancelQueries({ queryKey: ['folders'] });
      await queryClient.cancelQueries({ queryKey: ['folder', id] });

      const previousFolders = queryClient.getQueryData<FolderResponse[]>([
        'folders',
      ]);
      const previousFolder = queryClient.getQueryData<FolderResponse>([
        'folder',
        id,
      ]);

      queryClient.setQueryData(['folders'], (old: FolderResponse[] = []) =>
        old.map((d) => (d.id === id ? { ...d, ...data } : d)),
      );

      queryClient.setQueryData(['folder', id], (old?: FolderResponse) => ({
        ...old,
        ...data,
      }));
      return { previousFolders, previousFolder };
    },

    // Rollback in case of failure
    onError: (_, __, ctx) => {
      if (ctx?.previousFolders)
        queryClient.setQueryData(['folders'], ctx.previousFolders);
      if (ctx?.previousFolder)
        queryClient.setQueryData(
          ['folder', ctx.previousFolder.id],
          ctx.previousFolder,
        );
    },

    // Ensure final backend sync
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['folder', id] });
    },
  });
};
