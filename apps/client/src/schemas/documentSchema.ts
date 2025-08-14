import { z } from 'zod';

export const DocumentMetadataSchema = z.object({
  author: z.string(),
  createdDate: z.string(),
  version: z.string(),
  language: z.string(),
});

export const DocumentSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  size: z.string(),
  pages: z.number(),
  uploadedAt: z.string(),
  modified: z.string(),
  status: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  summary: z.string(),
  extractedText: z.string(),
  metadata: DocumentMetadataSchema,
  url: z.string().url(),
});

export const DocumentsArraySchema = z.array(DocumentSchema);
