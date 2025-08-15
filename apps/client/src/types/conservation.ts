export interface MessageReference {
  documentId: string;
  page: number;
  section?: string;
  text?: string;
}

export interface MessageSource {
  documentId: string;
  page: number;
  confidence: number;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | string;
  content: string;
  timestamp: string;
  references?: MessageReference[];
  sources?: MessageSource[];
}

export interface Conversation {
  id: string;
  name: string;
  type: 'chat' | 'thread' | string;
  documentIds: number[];
  messageCount: number;
  createdAt: string;
  modified: string;
  status: 'active' | 'archived' | string;
  summary: string;
  messages: Message[];
}
