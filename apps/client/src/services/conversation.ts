import { coreApi } from '@/lib/api';
import {
  ConversationCreate,
  ConversationUpdate,
} from '@/lib/generated/core/data-contracts';

export const ConversationService = {
  list: () => coreApi.getAllConversations(),
  get: (id: string) => coreApi.getConversation(id),
  create: (data: ConversationCreate) => coreApi.createConversation(data),
  update: (id: string, data: ConversationUpdate) =>
    coreApi.updateConversation(id, data),
  delete: (id: string) => coreApi.deleteConversation(id),
};
