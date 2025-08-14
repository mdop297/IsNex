export interface DocumentMetadata {
  author: string;
  createdDate: string;
  version: string;
  language: string;
}

export interface Document {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | string;
  size: string;
  pages: number;
  uploadedAt: string;
  modified: string;
  status: 'processed' | 'processing' | 'error' | string;
  category: string;
  tags: string[];
  summary: string;
  extractedText: string;
  metadata: DocumentMetadata;
  url: string;
}
