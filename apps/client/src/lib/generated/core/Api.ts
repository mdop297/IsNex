/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  AIMessage,
  BodyUploadFile,
  ConversationCreate,
  ConversationResponse,
  ConversationUpdate,
  DocumentResponse,
  DocumentUpdate,
  FolderCreate,
  FolderResponse,
  FolderUpdate,
  HTTPValidationError,
  HighlightCreate,
  HighlightResponse,
  HighlightUpdate,
  MessageCreate,
  MessageResponse,
  MessageUpdate,
  NoteBlockCreate,
  NoteBlockResponse,
  NoteBlockUpdate,
  NoteCreate,
  NoteResponse,
  NoteUpdate,
  PaginatedConversationResponse,
  PaginatedHighlightResponse,
  PresignedUrlResponse,
  PromptCreate,
  PromptResponse,
  PromptUpdate,
  WorkspaceCreate,
  WorkspaceMetaResponse,
  WorkspaceResponse,
  WorkspaceUpdate,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags agent
   * @name Index
   * @summary Index
   * @request GET:/api/v1/agent/
   */
  index = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/api/v1/agent/`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags agent
   * @name Chat
   * @summary Chat
   * @request POST:/api/v1/agent/chat
   */
  chat = (data: Record<string, any>, params: RequestParams = {}) =>
    this.request<AIMessage, HTTPValidationError>({
      path: `/api/v1/agent/chat`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags agent
   * @name StreamChat
   * @summary Stream Chat
   * @request POST:/api/v1/agent/stream_chat
   */
  streamChat = (data: Record<string, any>, params: RequestParams = {}) =>
    this.request<AIMessage, HTTPValidationError>({
      path: `/api/v1/agent/stream_chat`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags documents
   * @name UploadFile
   * @summary Upload File
   * @request POST:/api/v1/documents/
   */
  uploadFile = (data: BodyUploadFile, params: RequestParams = {}) =>
    this.request<DocumentResponse, HTTPValidationError>({
      path: `/api/v1/documents/`,
      method: 'POST',
      body: data,
      type: ContentType.FormData,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags documents
   * @name GetAllDocumentsByUser
   * @summary Get All Documents By User
   * @request GET:/api/v1/documents/all
   */
  getAllDocumentsByUser = (params: RequestParams = {}) =>
    this.request<DocumentResponse[], any>({
      path: `/api/v1/documents/all`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags documents
   * @name GetDocumentsByFolderId
   * @summary Get Documents By Folder Id
   * @request GET:/api/v1/documents/fs
   */
  getDocumentsByFolderId = (
    query?: {
      /** Folder Id */
      folder_id?: string | null;
    },
    params: RequestParams = {},
  ) =>
    this.request<DocumentResponse[], HTTPValidationError>({
      path: `/api/v1/documents/fs`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags documents
   * @name LoadDocument
   * @summary Load Document
   * @request GET:/api/v1/documents/load/{id}
   */
  loadDocument = (id: string, params: RequestParams = {}) =>
    this.request<string, HTTPValidationError>({
      path: `/api/v1/documents/load/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags documents
   * @name GetDocumentMeta
   * @summary Get Document Meta
   * @request GET:/api/v1/documents/{id}
   */
  getDocumentMeta = (id: string, params: RequestParams = {}) =>
    this.request<DocumentResponse, HTTPValidationError>({
      path: `/api/v1/documents/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags documents
   * @name UpdateDocument
   * @summary Update Document
   * @request PATCH:/api/v1/documents/{id}
   */
  updateDocument = (
    id: string,
    data: DocumentUpdate,
    params: RequestParams = {},
  ) =>
    this.request<DocumentResponse, HTTPValidationError>({
      path: `/api/v1/documents/${id}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags documents
   * @name DeleteDocument
   * @summary Delete Document
   * @request DELETE:/api/v1/documents/{id}
   */
  deleteDocument = (id: string, params: RequestParams = {}) =>
    this.request<boolean, HTTPValidationError>({
      path: `/api/v1/documents/${id}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags documents
   * @name DownloadDocument
   * @summary Download Document
   * @request GET:/api/v1/documents/download/{id}
   */
  downloadDocument = (id: string, params: RequestParams = {}) =>
    this.request<PresignedUrlResponse, HTTPValidationError>({
      path: `/api/v1/documents/download/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags folders
   * @name GetAllFoldersByUser
   * @summary Get All Folders By User
   * @request GET:/api/v1/folders/
   */
  getAllFoldersByUser = (params: RequestParams = {}) =>
    this.request<FolderResponse[], any>({
      path: `/api/v1/folders/`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags folders
   * @name CreateFolder
   * @summary Create Folder
   * @request POST:/api/v1/folders/
   */
  createFolder = (data: FolderCreate, params: RequestParams = {}) =>
    this.request<FolderResponse, HTTPValidationError>({
      path: `/api/v1/folders/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags folders
   * @name GetFolderById
   * @summary Get Folder By Id
   * @request GET:/api/v1/folders/{id}
   */
  getFolderById = (id: string, params: RequestParams = {}) =>
    this.request<FolderResponse, HTTPValidationError>({
      path: `/api/v1/folders/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags folders
   * @name UpdateFolder
   * @summary Update Folder
   * @request PATCH:/api/v1/folders/{id}
   */
  updateFolder = (id: string, data: FolderUpdate, params: RequestParams = {}) =>
    this.request<FolderResponse, HTTPValidationError>({
      path: `/api/v1/folders/${id}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags folders
   * @name DeleteFolder
   * @summary Delete Folder
   * @request DELETE:/api/v1/folders/{id}
   */
  deleteFolder = (id: string, params: RequestParams = {}) =>
    this.request<any, HTTPValidationError>({
      path: `/api/v1/folders/${id}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags highlights
   * @name CreateHighlight
   * @summary Create Highlight
   * @request POST:/api/v1/hls/
   */
  createHighlight = (data: HighlightCreate, params: RequestParams = {}) =>
    this.request<HighlightResponse, HTTPValidationError>({
      path: `/api/v1/hls/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags highlights
   * @name UpdateHighlight
   * @summary Update Highlight
   * @request PATCH:/api/v1/hls/{id}
   */
  updateHighlight = (
    id: string,
    data: HighlightUpdate,
    params: RequestParams = {},
  ) =>
    this.request<HighlightResponse, HTTPValidationError>({
      path: `/api/v1/hls/${id}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags highlights
   * @name GetHighlightById
   * @summary Get Highlight By Id
   * @request GET:/api/v1/hls/{id}
   */
  getHighlightById = (id: string, params: RequestParams = {}) =>
    this.request<HighlightResponse, HTTPValidationError>({
      path: `/api/v1/hls/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags highlights
   * @name DeleteHighlight
   * @summary Delete Highlight
   * @request DELETE:/api/v1/hls/{id}
   */
  deleteHighlight = (id: string, params: RequestParams = {}) =>
    this.request<boolean, HTTPValidationError>({
      path: `/api/v1/hls/${id}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags highlights
   * @name GetAllHighlightsByDocument
   * @summary Get All Highlights By Document
   * @request GET:/api/v1/hls/doc/{doc_id}
   */
  getAllHighlightsByDocument = (docId: string, params: RequestParams = {}) =>
    this.request<HighlightResponse[], HTTPValidationError>({
      path: `/api/v1/hls/doc/${docId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags highlights
   * @name GetAllHighlightsByUser
   * @summary Get All Highlights By User
   * @request GET:/api/v1/hls/user
   */
  getAllHighlightsByUser = (
    query?: {
      /**
       * Skip
       * @min 0
       * @default 0
       */
      skip?: number;
      /**
       * Limit
       * @min 1
       * @max 100
       * @default 25
       */
      limit?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<PaginatedHighlightResponse, HTTPValidationError>({
      path: `/api/v1/hls/user`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags conversations
   * @name CreateConversation
   * @summary Create Conversation
   * @request POST:/api/v1/convs/
   */
  createConversation = (data: ConversationCreate, params: RequestParams = {}) =>
    this.request<ConversationResponse, HTTPValidationError>({
      path: `/api/v1/convs/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags conversations
   * @name UpdateConversation
   * @summary Update Conversation
   * @request PATCH:/api/v1/convs/{id}
   */
  updateConversation = (
    id: string,
    data: ConversationUpdate,
    params: RequestParams = {},
  ) =>
    this.request<ConversationResponse, HTTPValidationError>({
      path: `/api/v1/convs/${id}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags conversations
   * @name GetConversation
   * @summary Get Conversation
   * @request GET:/api/v1/convs/{id}
   */
  getConversation = (id: string, params: RequestParams = {}) =>
    this.request<ConversationResponse, HTTPValidationError>({
      path: `/api/v1/convs/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags conversations
   * @name DeleteConversation
   * @summary Delete Conversation
   * @request DELETE:/api/v1/convs/{id}
   */
  deleteConversation = (id: string, params: RequestParams = {}) =>
    this.request<boolean, HTTPValidationError>({
      path: `/api/v1/convs/${id}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags conversations
   * @name GetAllConversations
   * @summary Get All Conversations
   * @request GET:/api/v1/convs/user
   */
  getAllConversations = (params: RequestParams = {}) =>
    this.request<PaginatedConversationResponse, any>({
      path: `/api/v1/convs/user`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags conversations
   * @name GetConversationsByWorkspace
   * @summary Get Conversations By Workspace
   * @request GET:/api/v1/convs/workspace/{workspace_id}
   */
  getConversationsByWorkspace = (
    workspaceId: string,
    params: RequestParams = {},
  ) =>
    this.request<PaginatedConversationResponse, HTTPValidationError>({
      path: `/api/v1/convs/workspace/${workspaceId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags messages
   * @name CreateMessage
   * @summary Create Message
   * @request POST:/api/v1/messages/
   */
  createMessage = (data: MessageCreate, params: RequestParams = {}) =>
    this.request<MessageResponse, HTTPValidationError>({
      path: `/api/v1/messages/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags messages
   * @name UpdateMessae
   * @summary Update Messae
   * @request PATCH:/api/v1/messages/{id}
   */
  updateMessae = (
    id: string,
    data: MessageUpdate,
    params: RequestParams = {},
  ) =>
    this.request<MessageResponse, HTTPValidationError>({
      path: `/api/v1/messages/${id}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags messages
   * @name GetMessageById
   * @summary Get Message By Id
   * @request GET:/api/v1/messages/{id}
   */
  getMessageById = (id: string, params: RequestParams = {}) =>
    this.request<MessageResponse, HTTPValidationError>({
      path: `/api/v1/messages/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags messages
   * @name DeleteMessage
   * @summary Delete Message
   * @request DELETE:/api/v1/messages/{id}
   */
  deleteMessage = (id: string, params: RequestParams = {}) =>
    this.request<boolean, HTTPValidationError>({
      path: `/api/v1/messages/${id}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags messages
   * @name GetMessagesOfConv
   * @summary Get Messages Of Conv
   * @request GET:/api/v1/messages/conv/{id}
   */
  getMessagesOfConv = (id: string, params: RequestParams = {}) =>
    this.request<MessageResponse[], HTTPValidationError>({
      path: `/api/v1/messages/conv/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags note
   * @name CreateNote
   * @summary Create Note
   * @request POST:/api/v1/note/
   */
  createNote = (data: NoteCreate, params: RequestParams = {}) =>
    this.request<NoteResponse, HTTPValidationError>({
      path: `/api/v1/note/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags note
   * @name UpdateNote
   * @summary Update Note
   * @request PATCH:/api/v1/note/{id}
   */
  updateNote = (id: string, data: NoteUpdate, params: RequestParams = {}) =>
    this.request<NoteResponse, HTTPValidationError>({
      path: `/api/v1/note/${id}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags note
   * @name GetNote
   * @summary Get Note
   * @request GET:/api/v1/note/{id}
   */
  getNote = (id: string, params: RequestParams = {}) =>
    this.request<NoteResponse, HTTPValidationError>({
      path: `/api/v1/note/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags note
   * @name DeleteNote
   * @summary Delete Note
   * @request DELETE:/api/v1/note/{id}
   */
  deleteNote = (id: string, params: RequestParams = {}) =>
    this.request<boolean, HTTPValidationError>({
      path: `/api/v1/note/${id}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags note
   * @name GetAllNotesByUser
   * @summary Get All Notes By User
   * @request GET:/api/v1/note/all
   */
  getAllNotesByUser = (params: RequestParams = {}) =>
    this.request<NoteResponse[], any>({
      path: `/api/v1/note/all`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags noteblocks
   * @name CreateNoteblock
   * @summary Create Noteblock
   * @request POST:/api/v1/noteblocks/
   */
  createNoteblock = (data: NoteBlockCreate, params: RequestParams = {}) =>
    this.request<NoteBlockResponse, HTTPValidationError>({
      path: `/api/v1/noteblocks/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags noteblocks
   * @name UpdateNoteblock
   * @summary Update Noteblock
   * @request PATCH:/api/v1/noteblocks/{id}
   */
  updateNoteblock = (
    id: string,
    data: NoteBlockUpdate,
    params: RequestParams = {},
  ) =>
    this.request<NoteBlockResponse, HTTPValidationError>({
      path: `/api/v1/noteblocks/${id}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags noteblocks
   * @name DeleteNoteblock
   * @summary Delete Noteblock
   * @request DELETE:/api/v1/noteblocks/{id}
   */
  deleteNoteblock = (id: string, params: RequestParams = {}) =>
    this.request<boolean, HTTPValidationError>({
      path: `/api/v1/noteblocks/${id}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags noteblocks
   * @name GetNoteblock
   * @summary Get Noteblock
   * @request GET:/api/v1/noteblocks/{id}
   */
  getNoteblock = (id: string, params: RequestParams = {}) =>
    this.request<NoteBlockResponse, HTTPValidationError>({
      path: `/api/v1/noteblocks/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags noteblocks
   * @name GetAllNoteblocksOfNote
   * @summary Get All Noteblocks Of Note
   * @request GET:/api/v1/noteblocks/note/{note_id}
   */
  getAllNoteblocksOfNote = (noteId: string, params: RequestParams = {}) =>
    this.request<NoteBlockResponse[], HTTPValidationError>({
      path: `/api/v1/noteblocks/note/${noteId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags prompts
   * @name GetAllPromptsByUser
   * @summary Get All Prompts By User
   * @request GET:/api/v1/prompts/
   */
  getAllPromptsByUser = (params: RequestParams = {}) =>
    this.request<PromptResponse[], any>({
      path: `/api/v1/prompts/`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags prompts
   * @name CreatePrompt
   * @summary Create Prompt
   * @request POST:/api/v1/prompts/
   */
  createPrompt = (data: PromptCreate, params: RequestParams = {}) =>
    this.request<PromptResponse, HTTPValidationError>({
      path: `/api/v1/prompts/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags prompts
   * @name UpdatePrompt
   * @summary Update Prompt
   * @request PATCH:/api/v1/prompts/{id}
   */
  updatePrompt = (id: string, data: PromptUpdate, params: RequestParams = {}) =>
    this.request<PromptResponse, HTTPValidationError>({
      path: `/api/v1/prompts/${id}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags prompts
   * @name GetPromptById
   * @summary Get Prompt By Id
   * @request GET:/api/v1/prompts/{id}
   */
  getPromptById = (id: string, params: RequestParams = {}) =>
    this.request<PromptResponse, HTTPValidationError>({
      path: `/api/v1/prompts/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags prompts
   * @name DeletePrompt
   * @summary Delete Prompt
   * @request DELETE:/api/v1/prompts/{id}
   */
  deletePrompt = (id: string, params: RequestParams = {}) =>
    this.request<boolean, HTTPValidationError>({
      path: `/api/v1/prompts/${id}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspace
   * @name GetAllWorkspacesByUser
   * @summary Get All Workspaces By User
   * @request GET:/api/v1/workspace/
   */
  getAllWorkspacesByUser = (params: RequestParams = {}) =>
    this.request<WorkspaceResponse[], void>({
      path: `/api/v1/workspace/`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspace
   * @name CreateWorkspace
   * @summary Create Workspace
   * @request POST:/api/v1/workspace/
   */
  createWorkspace = (data: WorkspaceCreate, params: RequestParams = {}) =>
    this.request<WorkspaceResponse, void | HTTPValidationError>({
      path: `/api/v1/workspace/`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspace
   * @name GetWorkspaceById
   * @summary Get Workspace By Id
   * @request GET:/api/v1/workspace/{workspace_id}
   */
  getWorkspaceById = (workspaceId: string, params: RequestParams = {}) =>
    this.request<WorkspaceResponse, void | HTTPValidationError>({
      path: `/api/v1/workspace/${workspaceId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspace
   * @name UpdateWorkspace
   * @summary Update Workspace
   * @request PATCH:/api/v1/workspace/{workspace_id}
   */
  updateWorkspace = (
    workspaceId: string,
    data: WorkspaceUpdate,
    params: RequestParams = {},
  ) =>
    this.request<WorkspaceResponse, void | HTTPValidationError>({
      path: `/api/v1/workspace/${workspaceId}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspace
   * @name DeleteWorkspace
   * @summary Delete Workspace
   * @request DELETE:/api/v1/workspace/{workspace_id}
   */
  deleteWorkspace = (workspaceId: string, params: RequestParams = {}) =>
    this.request<boolean, void | HTTPValidationError>({
      path: `/api/v1/workspace/${workspaceId}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspace
   * @name GetWorkspaceMeta
   * @summary Get Workspace Meta
   * @request GET:/api/v1/workspace/meta/{workspace_id}
   */
  getWorkspaceMeta = (workspaceId: string, params: RequestParams = {}) =>
    this.request<WorkspaceMetaResponse, void | HTTPValidationError>({
      path: `/api/v1/workspace/meta/${workspaceId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspace
   * @name AddDocumentToWorkspace
   * @summary Add Document To Workspace
   * @request POST:/api/v1/workspace/{workspace_id}/document/{document_id}
   */
  addDocumentToWorkspace = (
    workspaceId: string,
    documentId: string,
    params: RequestParams = {},
  ) =>
    this.request<WorkspaceResponse, void | HTTPValidationError>({
      path: `/api/v1/workspace/${workspaceId}/document/${documentId}`,
      method: 'POST',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Workspace
   * @name RemoveDocumentFromWorkspace
   * @summary Remove Document From Workspace
   * @request DELETE:/api/v1/workspace/{workspace_id}/document/{document_id}
   */
  removeDocumentFromWorkspace = (
    workspaceId: string,
    documentId: string,
    params: RequestParams = {},
  ) =>
    this.request<WorkspaceResponse, void | HTTPValidationError>({
      path: `/api/v1/workspace/${workspaceId}/document/${documentId}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
}
