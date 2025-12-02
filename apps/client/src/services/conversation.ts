import { coreApi } from '@/lib/api';
import {
  ConversationCreate,
  ConversationUpdate,
} from '@/lib/generated/core/data-contracts';

export const ConversationService = {
  list: async () => await coreApi.getAllConversations(),
  get: async (id: string) => await coreApi.getConversation(id),
  create: async (data: ConversationCreate) =>
    await coreApi.createConversation(data),
  update: async (id: string, data: ConversationUpdate) =>
    await coreApi.updateConversation(id, data),
  delete: async (id: string) => await coreApi.deleteConversation(id),
};
