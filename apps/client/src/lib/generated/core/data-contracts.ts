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

/** Status */
export enum Status {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/** SenderType */
export enum SenderType {
  User = 'user',
  System = 'system',
}

/** ReactionType */
export enum ReactionType {
  Like = 'like',
  Dislike = 'dislike',
}

/** PromptType */
export enum PromptType {
  User = 'user',
  Workspace = 'workspace',
}

/** NoteBlockType */
export enum NoteBlockType {
  Text = 'text',
  Image = 'image',
}

/** HighlightType */
export enum HighlightType {
  TEXT = 'TEXT',
  AREA = 'AREA',
}

/** FileType */
export enum FileType {
  Pdf = 'pdf',
  Docx = 'docx',
  Xlsx = 'xlsx',
  Pptx = 'pptx',
  Image = 'image',
}

/**
 * AIMessage
 * Message from an AI.
 *
 * An `AIMessage` is returned from a chat model as a response to a prompt.
 *
 * This message represents the output of the model and consists of both
 * the raw output as returned by the model and standardized fields
 * (e.g., tool calls, usage metadata) added by the LangChain framework.
 */
export interface AIMessage {
  /** Content */
  content: string | (string | Record<string, any>)[];
  /** Additional Kwargs */
  additional_kwargs?: Record<string, any>;
  /** Response Metadata */
  response_metadata?: Record<string, any>;
  /**
   * Type
   * @default "ai"
   */
  type?: 'ai';
  /** Name */
  name?: string | null;
  /** Id */
  id?: string | null;
  /**
   * Tool Calls
   * @default []
   */
  tool_calls?: ToolCall[];
  /**
   * Invalid Tool Calls
   * @default []
   */
  invalid_tool_calls?: InvalidToolCall[];
  usage_metadata?: UsageMetadata | null;
  [key: string]: any;
}

/** Body_upload_file */
export interface BodyUploadFile {
  /** Metadata */
  metadata: string;
  /**
   * File
   * @format binary
   */
  file: File;
}

/** ConversationCreate */
export interface ConversationCreate {
  /**
   * Workspace Id
   * Associated workspace ID
   */
  workspace_id?: string | null;
  /**
   * Title
   * Title of the conversation
   * @default "New Conversation"
   */
  title?: string | null;
}

/** ConversationResponse */
export interface ConversationResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /**
   * User Id
   * @format uuid
   */
  user_id: string;
  /** Workspace Id */
  workspace_id?: string | null;
  /** Title */
  title: string;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** ConversationUpdate */
export interface ConversationUpdate {
  /**
   * Id
   * ID of the conversation to update
   * @format uuid
   */
  id: string;
  /**
   * Title
   * Title of the conversation
   */
  title?: string | null;
}

/** DocumentResponse */
export interface DocumentResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Folder Id */
  folder_id?: string | null;
  /** Name */
  name: string;
  type: FileType;
  /** Num Pages */
  num_pages: number;
  /** @default "UPLOADED" */
  embedding_status?: Status;
  /** File Size */
  file_size: string;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** DocumentUpdate */
export interface DocumentUpdate {
  /** Folder Id */
  folder_id?: string | null;
  /** Name */
  name?: string | null;
}

/** FolderCreate */
export interface FolderCreate {
  /**
   * Parent Id
   * parent folder id
   */
  parent_id?: string | null;
  /**
   * Name
   * name of the folder
   * @default "Untitled"
   */
  name?: string;
  /**
   * Path
   * path of the folder
   * @default "/"
   */
  path?: string;
}

/** FolderResponse */
export interface FolderResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Parent Id */
  parent_id?: string | null;
  /** Name */
  name: string;
  /** Path */
  path: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** FolderUpdate */
export interface FolderUpdate {
  /**
   * Parent Id
   * parent folder id
   */
  parent_id?: string | null;
  /**
   * Name
   * name of the folder
   */
  name?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HighlightCreate */
export interface HighlightCreate {
  /** User Id */
  user_id?: string | null;
  /**
   * Document Id
   * @format uuid
   */
  document_id: string;
  /** Page Number */
  page_number: number;
  /** Color */
  color: string;
  highlight_type: HighlightType;
  /** Comment */
  comment?: string | null;
  /** Text */
  text?: string | null;
  /** Image */
  image: File | null;
  position: Position;
}

/** HighlightResponse */
export interface HighlightResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /**
   * Document Id
   * @format uuid
   */
  document_id: string;
  /** Page Number */
  page_number: number;
  /** Color */
  color: string;
  highlight_type: HighlightType;
  /** Comment */
  comment?: string | null;
  /** Text */
  text?: string | null;
  /** Image */
  image: File | null;
  position: Position;
}

/** HighlightUpdate */
export interface HighlightUpdate {
  /** Color */
  color?: string | null;
  /** Comment */
  comment?: string | null;
}

/**
 * InputTokenDetails
 * Breakdown of input token counts.
 *
 * Does *not* need to sum to full input token count. Does *not* need to have all keys.
 *
 * Example:
 *     ```python
 *     {
 *         "audio": 10,
 *         "cache_creation": 200,
 *         "cache_read": 100,
 *     }
 *     ```
 *
 * May also hold extra provider-specific keys.
 *
 * !!! version-added "Added in `langchain-core` 0.3.9"
 */
export interface InputTokenDetails {
  /** Audio */
  audio?: number;
  /** Cache Creation */
  cache_creation?: number;
  /** Cache Read */
  cache_read?: number;
  [key: string]: any;
}

/**
 * InvalidToolCall
 * Allowance for errors made by LLM.
 *
 * Here we add an `error` key to surface errors made during generation
 * (e.g., invalid JSON arguments.)
 */
export interface InvalidToolCall {
  /** Type */
  type: 'invalid_tool_call';
  /** Id */
  id: string | null;
  /** Name */
  name: string | null;
  /** Args */
  args: string | null;
  /** Error */
  error: string | null;
  /** Index */
  index?: number | string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
}

/** MessageCreate */
export interface MessageCreate {
  /** User Id */
  user_id?: string | null;
  /**
   * Conv Id
   * ID of the conversation
   * @format uuid
   */
  conv_id: string;
  /** Sender type: user or system */
  sender?: SenderType | null;
  /**
   * Model Name
   * Model name if system generated
   */
  model_name?: string | null;
  /**
   * Content
   * Message content
   */
  content?: string | null;
}

/** MessageResponse */
export interface MessageResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /**
   * User Id
   * @format uuid
   */
  user_id: string;
  /**
   * Conv Id
   * @format uuid
   */
  conv_id: string;
  sender: SenderType;
  /** Model Name */
  model_name?: string | null;
  /** Content */
  content: string;
  reaction?: ReactionType | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** MessageUpdate */
export interface MessageUpdate {
  /**
   * Id
   * ID of the message to update
   * @format uuid
   */
  id: string;
  /** Model Name */
  model_name?: string | null;
  reaction?: ReactionType | null;
}

/** NoteBlockCreate */
export interface NoteBlockCreate {
  /**
   * Note Id
   * @format uuid
   */
  note_id: string;
  /** Parent Id */
  parent_id?: string | null;
  type: NoteBlockType;
  /** Props */
  props?: Record<string, any>;
  /** Content */
  content?: Record<string, any>;
  /** Order */
  order: number;
}

/** NoteBlockResponse */
export interface NoteBlockResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /**
   * Note Id
   * @format uuid
   */
  note_id: string;
  /** Parent Id */
  parent_id: string | null;
  type: NoteBlockType;
  /** Props */
  props: Record<string, any>;
  /** Content */
  content: Record<string, any>;
  /** Order */
  order: number;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
  /** Source Ids */
  source_ids?: string[] | null;
}

/** NoteBlockUpdate */
export interface NoteBlockUpdate {
  /** Parent Id */
  parent_id?: string | null;
  type?: NoteBlockType | null;
  /** Props */
  props?: Record<string, any> | null;
  /** Content */
  content?: Record<string, any> | null;
  /** Order */
  order?: number | null;
}

/** NoteCreate */
export interface NoteCreate {
  /** User Id */
  user_id?: string | null;
  /** Parent Id */
  parent_id?: string | null;
  /** Title */
  title: string;
  /** Icon */
  icon?: string | null;
  /**
   * Favorite
   * @default false
   */
  favorite?: boolean;
}

/** NoteResponse */
export interface NoteResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Parent Id */
  parent_id?: string | null;
  /**
   * User Id
   * @format uuid
   */
  user_id: string;
  /** Title */
  title: string;
  /** Icon */
  icon: string | null;
  /** Favorite */
  favorite: boolean;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
  /** Deleted At */
  deleted_at?: string | null;
}

/** NoteUpdate */
export interface NoteUpdate {
  /** Parent Id */
  parent_id?: string | null;
  /** Title */
  title?: string | null;
  /** Icon */
  icon?: string | null;
  /** Favorite */
  favorite?: boolean | null;
  /** Deleted At */
  deleted_at?: string | null;
}

/**
 * OutputTokenDetails
 * Breakdown of output token counts.
 *
 * Does *not* need to sum to full output token count. Does *not* need to have all keys.
 *
 * Example:
 *     ```python
 *     {
 *         "audio": 10,
 *         "reasoning": 200,
 *     }
 *     ```
 *
 * May also hold extra provider-specific keys.
 *
 * !!! version-added "Added in `langchain-core` 0.3.9"
 */
export interface OutputTokenDetails {
  /** Audio */
  audio?: number;
  /** Reasoning */
  reasoning?: number;
  [key: string]: any;
}

/** PaginatedConversationResponse */
export interface PaginatedConversationResponse {
  /** Items */
  items: ConversationResponse[];
  /** Total */
  total: number;
  /** Skip */
  skip: number;
  /** Limit */
  limit: number;
}

/** PaginatedHighlightResponse */
export interface PaginatedHighlightResponse {
  /** Items */
  items: HighlightResponse[];
  /** Total */
  total: number;
  /** Skip */
  skip: number;
  /** Limit */
  limit: number;
}

/** Position */
export interface Position {
  /** Height */
  height: number;
  /** Pagenumber */
  pageNumber: number;
  /** Width */
  width: number;
  /** X1 */
  x1: number;
  /** X2 */
  x2: number;
  /** Y1 */
  y1: number;
  /** Y2 */
  y2: number;
}

/** PresignedUrlResponse */
export interface PresignedUrlResponse {
  /** Url */
  url: string;
}

/** PromptCreate */
export interface PromptCreate {
  /** User Id */
  user_id?: string | null;
  /** Workspace Id */
  workspace_id?: string | null;
  /** Name */
  name: string;
  /** Content */
  content: string;
  /** @default "user" */
  type?: PromptType;
}

/** PromptResponse */
export interface PromptResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /**
   * User Id
   * @format uuid
   */
  user_id: string;
  /** Workspace Id */
  workspace_id?: string | null;
  /** Name */
  name: string;
  /** Content */
  content: string;
  type: PromptType;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** PromptUpdate */
export interface PromptUpdate {
  /** Name */
  name?: string | null;
  /** Content */
  content?: string | null;
  type?: PromptType | null;
  /** Workspace Id */
  workspace_id?: string | null;
}

/**
 * ToolCall
 * Represents an AI's request to call a tool.
 *
 * Example:
 *     ```python
 *     {"name": "foo", "args": {"a": 1}, "id": "123"}
 *     ```
 *
 *     This represents a request to call the tool named `'foo'` with arguments
 *     `{"a": 1}` and an identifier of `'123'`.
 */
export interface ToolCall {
  /** Name */
  name: string;
  /** Args */
  args: Record<string, any>;
  /** Id */
  id: string | null;
  /** Type */
  type?: 'tool_call';
  [key: string]: any;
}

/**
 * UsageMetadata
 * Usage metadata for a message, such as token counts.
 *
 * This is a standard representation of token usage that is consistent across models.
 *
 * Example:
 *     ```python
 *     {
 *         "input_tokens": 350,
 *         "output_tokens": 240,
 *         "total_tokens": 590,
 *         "input_token_details": {
 *             "audio": 10,
 *             "cache_creation": 200,
 *             "cache_read": 100,
 *         },
 *         "output_token_details": {
 *             "audio": 10,
 *             "reasoning": 200,
 *         },
 *     }
 *     ```
 *
 * !!! warning "Behavior changed in `langchain-core` 0.3.9"
 *
 *     Added `input_token_details` and `output_token_details`.
 *
 * !!! note "LangSmith SDK"
 *
 *     The LangSmith SDK also has a `UsageMetadata` class. While the two share fields,
 *     LangSmith's `UsageMetadata` has additional fields to capture cost information
 *     used by the LangSmith platform.
 */
export interface UsageMetadata {
  /** Input Tokens */
  input_tokens: number;
  /** Output Tokens */
  output_tokens: number;
  /** Total Tokens */
  total_tokens: number;
  /**
   * Breakdown of input token counts.
   *
   * Does *not* need to sum to full input token count. Does *not* need to have all keys.
   *
   * Example:
   *     ```python
   *     {
   *         "audio": 10,
   *         "cache_creation": 200,
   *         "cache_read": 100,
   *     }
   *     ```
   *
   * May also hold extra provider-specific keys.
   *
   * !!! version-added "Added in `langchain-core` 0.3.9"
   */
  input_token_details?: InputTokenDetails;
  /**
   * Breakdown of output token counts.
   *
   * Does *not* need to sum to full output token count. Does *not* need to have all keys.
   *
   * Example:
   *     ```python
   *     {
   *         "audio": 10,
   *         "reasoning": 200,
   *     }
   *     ```
   *
   * May also hold extra provider-specific keys.
   *
   * !!! version-added "Added in `langchain-core` 0.3.9"
   */
  output_token_details?: OutputTokenDetails;
  [key: string]: any;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** WorkspaceCreate */
export interface WorkspaceCreate {
  /** User Id */
  user_id?: string | null;
  /** Name */
  name: string;
  /** Icon */
  icon: string | null;
  /**
   * Description
   * @default ""
   */
  description?: string | null;
}

/** WorkspaceMetaResponse */
export interface WorkspaceMetaResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Name */
  name: string;
  /** Description */
  description: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
  /** Last Opened At */
  last_opened_at: string | null;
  /** Num Documents */
  num_documents: number;
  /** Num Conversations */
  num_conversations: number;
}

/** WorkspaceResponse */
export interface WorkspaceResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /**
   * User Id
   * @format uuid
   */
  user_id: string;
  /** Name */
  name: string;
  /** Icon */
  icon: string;
  /** Description */
  description: string;
  /** Active Conv */
  active_conv: string | null;
  /** Active Doc */
  active_doc: string | null;
  /** Active Note */
  active_note: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
}

/** WorkspaceUpdate */
export interface WorkspaceUpdate {
  /** Name */
  name?: string | null;
  /** Icon */
  icon?: string | null;
  /** Description */
  description?: string | null;
  /** Active Conv */
  active_conv?: string | null;
  /** Active Doc */
  active_doc?: string | null;
  /** Active Note */
  active_note?: string | null;
}
