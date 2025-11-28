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
    enabled: !!id,
    retry: false,
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

export const useUpdateChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-chat'],
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      await coreApi.updateConversation(id, { id, title });
    },
    onMutate: async ({ id, title }: { id: string; title: string }) => {
      await queryClient.cancelQueries({ queryKey: ['chats'] });
      await queryClient.cancelQueries({ queryKey: ['chat', id] });
      const previousChats =
        queryClient.getQueryData<PaginatedConversationResponse>(['chats']);

      const previousChat = queryClient.getQueryData<ConversationResponse>([
        'chat',
        id,
      ]);

      queryClient.setQueryData(
        ['chats'],
        (old: PaginatedConversationResponse) => ({
          ...old,
          items: old.items.map((item) =>
            item.id === id ? { ...item, title } : item,
          ),
        }),
      );

      queryClient.setQueryData(['chat', id], (old?: ConversationResponse) => ({
        ...old,
        title,
      }));
      return { previousChat, previousChats };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previousChat)
        queryClient.setQueryData(
          ['chat', ctx.previousChat.id],
          ctx.previousChat,
        );
      if (ctx?.previousChats)
        queryClient.setQueryData(['chats'], ctx.previousChats);
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', id] });
    },
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-chat'],
    mutationFn: async (id: string) => {
      await coreApi.deleteConversation(id);
    },
    onSuccess: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', id] });
    },
  });
};
