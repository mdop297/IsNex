import { coreApi } from '@/lib/api';
import {
  ConversationResponse,
  PaginatedConversationResponse,
} from '@/lib/generated/core/data-contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetChats = () => {
  return useQuery<PaginatedConversationResponse>({
    queryKey: ['chats'],
    queryFn: async () => {
      const res = await coreApi.getAllConversations();
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    },
  });
};

export const useGetChat = (id: string) => {
  return useQuery<ConversationResponse>({
    queryKey: ['chat', id],
    queryFn: async () => {
      const res = await coreApi.getConversation(id);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    },
  });
};

export const useCreateChat = (title: string = '') => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-chat'],
    mutationFn: async () => {
      const res = await coreApi.createConversation({
        title: title || 'New Chat',
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};
