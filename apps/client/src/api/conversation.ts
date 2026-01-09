import {
  ConversationResponse,
  PaginatedConversationResponse,
} from '@/lib/generated/core/data-contracts';
import { ConversationService } from '@/services/conversation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetConversations = () => {
  return useQuery<PaginatedConversationResponse>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await ConversationService.list();
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    },
  });
};

export const useGetConversation = (id: string) => {
  return useQuery<ConversationResponse>({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const res = await ConversationService.get(id);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    },
    enabled: !!id,
    retry: false,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-conversation'],
    mutationFn: async ({
      title,
      workspaceId,
    }: {
      title: string | null;
      workspaceId: string | null;
    }) => {
      const finalTitle = title?.trim() || 'New Conversation';

      const res = await ConversationService.create({
        title: finalTitle,
        workspace_id: workspaceId,
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useUpdateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-conversation'],
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      await ConversationService.update(id, { id, title });
    },
    onMutate: async ({ id, title }: { id: string; title: string }) => {
      await queryClient.cancelQueries({ queryKey: ['conversations'] });
      await queryClient.cancelQueries({ queryKey: ['conversation', id] });
      const previousConversations =
        queryClient.getQueryData<PaginatedConversationResponse>([
          'conversations',
        ]);

      const previousConversation =
        queryClient.getQueryData<ConversationResponse>(['conversation', id]);

      queryClient.setQueryData(
        ['conversations'],
        (old: PaginatedConversationResponse) => ({
          ...old,
          items: old.items.map((item) =>
            item.id === id ? { ...item, title } : item,
          ),
        }),
      );

      queryClient.setQueryData(
        ['conversation', id],
        (old?: ConversationResponse) => ({
          ...old,
          title,
        }),
      );
      return { previousConversation, previousConversations };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previousConversation)
        queryClient.setQueryData(
          ['conversation', ctx.previousConversation.id],
          ctx.previousConversation,
        );
      if (ctx?.previousConversations)
        queryClient.setQueryData(['conversations'], ctx.previousConversations);
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', id] });
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-conversation'],
    mutationFn: async (id: string) => {
      await ConversationService.delete(id);
    },
    onSuccess: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', id] });
    },
  });
};
