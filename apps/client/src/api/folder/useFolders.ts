import { coreApi } from '@/lib/api';
import { FolderCreate } from '@/lib/generated/core/data-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FolderResponse,
  FolderUpdate,
} from '@/lib/generated/core/data-contracts';

export const useFolders = () =>
  useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      // TODO: check this function again???
      const res = await coreApi.getAllFoldersByUser();
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.data;
    },
    staleTime: 60_000 * 30,
  });

export const useFolder = (id: string) =>
  useQuery({
    queryKey: ['folder', id],
    queryFn: async () => {
      const res = await coreApi.getFolderById(id);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.data;
    },
    staleTime: 60_000 * 30,
  });

export const useCreateFolder = (onClose?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-folder'],
    mutationFn: async (folderData: FolderCreate) => {
      console.log('Creating Folder in use mutation.');
      const res = await coreApi.createFolder(folderData);

      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      if (onClose) onClose();
    },
    onError: (err) => {
      console.error('Error creating folder:', err);
      alert('Failed to create folder: ' + (err as Error).message);
    },
  });
};

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

    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['folder', id] });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-folder'],
    mutationFn: async (id: string) => {
      await coreApi.deleteFolder(id);
    },

    onMutate: async (id: string) => {
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
        old.filter((d) => d.id !== id),
      );
      queryClient.setQueryData(['folder', id], undefined);

      return { previousFolders, previousFolder };
    },
    onError: (_, __, context) => {
      if (context?.previousFolders)
        queryClient.setQueryData(['folders'], context.previousFolders);
      if (context?.previousFolder)
        queryClient.setQueryData(
          ['folder', context.previousFolder.id],
          context.previousFolder,
        );
    },
    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['folder', id] });
    },
  });
};
