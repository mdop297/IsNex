import { coreApi } from '@/lib/api';
import { FolderCreate } from '@/lib/generated/core/data-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
