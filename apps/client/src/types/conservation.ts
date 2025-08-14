export interface MessageReference {
  documentId: number;
  page: number;
  section?: string;
  text?: string;
}

export interface MessageSource {
  documentId: number;
  page: number;
  confidence: number;
}

export interface Message {
  id: number;
  sender: 'user' | 'assistant' | string;
  content: string;
  timestamp: string;
  references?: MessageReference[];
  sources?: MessageSource[];
}

export interface Conversation {
  id: number;
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
