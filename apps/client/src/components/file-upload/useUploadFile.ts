import { Api } from '@/lib/generated/core/Api';
import { BodyUploadFile } from '@/lib/generated/core/data-contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const uploadApi = new Api({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  baseApiParams: {
    credentials: 'include',
  },
});

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['upload-file'],
    mutationFn: async (data: BodyUploadFile) => {
      return await uploadApi.uploadFile(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['docs'] });
    },
  });
};
