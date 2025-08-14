import { z } from 'zod';

export const MessageReferenceSchema = z.object({
  documentId: z.number(),
  page: z.number(),
  section: z.string().optional(),
  text: z.string().optional(),
});

export const MessageSourceSchema = z.object({
  documentId: z.number(),
  page: z.number(),
  confidence: z.number(),
});

export const MessageSchema = z.object({
  id: z.number(),
  sender: z.string(),
  content: z.string(),
  timestamp: z.string(),
  references: z.array(MessageReferenceSchema).optional(),
  sources: z.array(MessageSourceSchema).optional(),
});

export const ConversationSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  documentIds: z.array(z.number()),
  messageCount: z.number(),
  createdAt: z.string(),
  modified: z.string(),
  status: z.string(),
  summary: z.string(),
  messages: z.array(MessageSchema),
});

export const ConversationsArraySchema = z.array(ConversationSchema);
