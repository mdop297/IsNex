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

/** AIMessage */
export interface AIMessage {
  /** Content */
  content: string | (string | Record<string, any>)[];
  /** Additional Kwargs */
  additional_kwargs?: Record<string, any>;
  /** Response Metadata */
  response_metadata?: Record<string, any>;
  /**
   * Type
   * @default "AIMessageChunk"
   */
  type?: 'AIMessageChunk';
  /** Name */
  name?: string | null;
  /** Id */
  id?: string | null;
  /**
   * Tool Calls
   * @default []
   */
  tool_calls?: LangchainCoreMessagesToolToolCall[];
  /**
   * Invalid Tool Calls
   * @default []
   */
  invalid_tool_calls?: InvalidToolCall[];
  usage_metadata?: UsageMetadata | null;
  /**
   * Tool Call Chunks
   * @default []
   */
  tool_call_chunks?: LangchainCoreMessagesToolToolCallChunk[];
  /** Chunk Position */
  chunk_position?: 'last' | null;
  /** Content Block */
  content_block: (
    | TextContentBlock
    | InvalidToolCall
    | ReasoningContentBlock
    | NonStandardContentBlock
    | ImageContentBlock
    | VideoContentBlock
    | AudioContentBlock
    | PlainTextContentBlock
    | FileContentBlock
    | LangchainCoreMessagesContentToolCall
    | LangchainCoreMessagesContentToolCallChunk
    | ServerToolCall
    | ServerToolCallChunk
    | ServerToolResult
  )[];
  [key: string]: any;
}

/**
 * AudioContentBlock
 * Audio data.
 *
 * !!! note "Factory function"
 *     `create_audio_block` may also be used as a factory to create an
 *     `AudioContentBlock`. Benefits include:
 *     * Automatic ID generation (when not provided)
 *     * Required arguments strictly validated at creation time
 */
export interface AudioContentBlock {
  /** Type */
  type: 'audio';
  /** Id */
  id?: string;
  /** File Id */
  file_id?: string;
  /** Mime Type */
  mime_type?: string;
  /** Index */
  index?: number | string;
  /** Url */
  url?: string;
  /** Base64 */
  base64?: string;
  /** Extras */
  extras?: Record<string, any>;
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

/**
 * Citation
 * Annotation for citing data from a document.
 *
 * !!! note
 *     `start`/`end` indices refer to the **response text**,
 *     not the source text. This means that the indices are relative to the model's
 *     response, not the original document (as specified in the `url`).
 *
 * !!! note "Factory function"
 *     `create_citation` may also be used as a factory to create a `Citation`.
 *     Benefits include:
 *
 *     * Automatic ID generation (when not provided)
 *     * Required arguments strictly validated at creation time
 */
export interface Citation {
  /** Type */
  type: 'citation';
  /** Id */
  id?: string;
  /** Url */
  url?: string;
  /** Title */
  title?: string;
  /** Start Index */
  start_index?: number;
  /** End Index */
  end_index?: number;
  /** Cited Text */
  cited_text?: string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
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

/**
 * FileContentBlock
 * File data that doesn't fit into other multimodal block types.
 *
 * This block is intended for files that are not images, audio, or plaintext. For
 * example, it can be used for PDFs, Word documents, etc.
 *
 * If the file is an image, audio, or plaintext, you should use the corresponding
 * content block type (e.g., `ImageContentBlock`, `AudioContentBlock`,
 * `PlainTextContentBlock`).
 *
 * !!! note "Factory function"
 *     `create_file_block` may also be used as a factory to create a
 *     `FileContentBlock`. Benefits include:
 *
 *     * Automatic ID generation (when not provided)
 *     * Required arguments strictly validated at creation time
 */
export interface FileContentBlock {
  /** Type */
  type: 'file';
  /** Id */
  id?: string;
  /** File Id */
  file_id?: string;
  /** Mime Type */
  mime_type?: string;
  /** Index */
  index?: number | string;
  /** Url */
  url?: string;
  /** Base64 */
  base64?: string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
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
 * ImageContentBlock
 * Image data.
 *
 * !!! note "Factory function"
 *     `create_image_block` may also be used as a factory to create a
 *     `ImageContentBlock`. Benefits include:
 *
 *     * Automatic ID generation (when not provided)
 *     * Required arguments strictly validated at creation time
 */
export interface ImageContentBlock {
  /** Type */
  type: 'image';
  /** Id */
  id?: string;
  /** File Id */
  file_id?: string;
  /** Mime Type */
  mime_type?: string;
  /** Index */
  index?: number | string;
  /** Url */
  url?: string;
  /** Base64 */
  base64?: string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
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

/**
 * NonStandardAnnotation
 * Provider-specific annotation format.
 */
export interface NonStandardAnnotation {
  /** Type */
  type: 'non_standard_annotation';
  /** Id */
  id?: string;
  /** Value */
  value: Record<string, any>;
  [key: string]: any;
}

/**
 * NonStandardContentBlock
 * Provider-specific content data.
 *
 * This block contains data for which there is not yet a standard type.
 *
 * The purpose of this block should be to simply hold a provider-specific payload.
 * If a provider's non-standard output includes reasoning and tool calls, it should be
 * the adapter's job to parse that payload and emit the corresponding standard
 * `ReasoningContentBlock` and `ToolCalls`.
 *
 * Has no `extras` field, as provider-specific data should be included in the
 * `value` field.
 *
 * !!! note "Factory function"
 *     `create_non_standard_block` may also be used as a factory to create a
 *     `NonStandardContentBlock`. Benefits include:
 *
 *     * Automatic ID generation (when not provided)
 *     * Required arguments strictly validated at creation time
 */
export interface NonStandardContentBlock {
  /** Type */
  type: 'non_standard';
  /** Id */
  id?: string;
  /** Value */
  value: Record<string, any>;
  /** Index */
  index?: number | string;
  [key: string]: any;
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

/**
 * PlainTextContentBlock
 * Plaintext data (e.g., from a `.txt` or `.md` document).
 *
 * !!! note
 *     A `PlainTextContentBlock` existed in `langchain-core<1.0.0`. Although the
 *     name has carried over, the structure has changed significantly. The only shared
 *     keys between the old and new versions are `type` and `text`, though the
 *     `type` value has changed from `'text'` to `'text-plain'`.
 *
 * !!! note
 *     Title and context are optional fields that may be passed to the model. See
 *     Anthropic [example](https://platform.claude.com/docs/en/build-with-claude/citations#citable-vs-non-citable-content).
 *
 * !!! note "Factory function"
 *     `create_plaintext_block` may also be used as a factory to create a
 *     `PlainTextContentBlock`. Benefits include:
 *
 *     * Automatic ID generation (when not provided)
 *     * Required arguments strictly validated at creation time
 */
export interface PlainTextContentBlock {
  /** Type */
  type: 'text-plain';
  /** Id */
  id?: string;
  /** File Id */
  file_id?: string;
  /** Mime Type */
  mime_type: 'text/plain';
  /** Index */
  index?: number | string;
  /** Url */
  url?: string;
  /** Base64 */
  base64?: string;
  /** Text */
  text?: string;
  /** Title */
  title?: string;
  /** Context */
  context?: string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
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
 * ReasoningContentBlock
 * Reasoning output from a LLM.
 *
 * !!! note "Factory function"
 *     `create_reasoning_block` may also be used as a factory to create a
 *     `ReasoningContentBlock`. Benefits include:
 *
 *     * Automatic ID generation (when not provided)
 *     * Required arguments strictly validated at creation time
 */
export interface ReasoningContentBlock {
  /** Type */
  type: 'reasoning';
  /** Id */
  id?: string;
  /** Reasoning */
  reasoning?: string;
  /** Index */
  index?: number | string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
}

/**
 * ServerToolCall
 * Tool call that is executed server-side.
 *
 * For example: code execution, web search, etc.
 */
export interface ServerToolCall {
  /** Type */
  type: 'server_tool_call';
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** Args */
  args: Record<string, any>;
  /** Index */
  index?: number | string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
}

/**
 * ServerToolCallChunk
 * A chunk of a server-side tool call (yielded when streaming).
 */
export interface ServerToolCallChunk {
  /** Type */
  type: 'server_tool_call_chunk';
  /** Name */
  name?: string;
  /** Args */
  args?: string;
  /** Id */
  id?: string;
  /** Index */
  index?: number | string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
}

/**
 * ServerToolResult
 * Result of a server-side tool call.
 */
export interface ServerToolResult {
  /** Type */
  type: 'server_tool_result';
  /** Id */
  id?: string;
  /** Tool Call Id */
  tool_call_id: string;
  /** Status */
  status: 'success' | 'error';
  /** Output */
  output?: any;
  /** Index */
  index?: number | string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
}

/**
 * TextContentBlock
 * Text output from a LLM.
 *
 * This typically represents the main text content of a message, such as the response
 * from a language model or the text of a user message.
 *
 * !!! note "Factory function"
 *     `create_text_block` may also be used as a factory to create a
 *     `TextContentBlock`. Benefits include:
 *
 *     * Automatic ID generation (when not provided)
 *     * Required arguments strictly validated at creation time
 */
export interface TextContentBlock {
  /** Type */
  type: 'text';
  /** Id */
  id?: string;
  /** Text */
  text: string;
  /** Annotations */
  annotations?: (Citation | NonStandardAnnotation)[];
  /** Index */
  index?: number | string;
  /** Extras */
  extras?: Record<string, any>;
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

/**
 * VideoContentBlock
 * Video data.
 *
 * !!! note "Factory function"
 *     `create_video_block` may also be used as a factory to create a
 *     `VideoContentBlock`. Benefits include:
 *
 *     * Automatic ID generation (when not provided)
 *     * Required arguments strictly validated at creation time
 */
export interface VideoContentBlock {
  /** Type */
  type: 'video';
  /** Id */
  id?: string;
  /** File Id */
  file_id?: string;
  /** Mime Type */
  mime_type?: string;
  /** Index */
  index?: number | string;
  /** Url */
  url?: string;
  /** Base64 */
  base64?: string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
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

/**
 * ToolCall
 * Represents an AI's request to call a tool.
 *
 * Example:
 *     ```python
 *     {"name": "foo", "args": {"a": 1}, "id": "123"}
 *     ```
 *
 *     This represents a request to call the tool named "foo" with arguments {"a": 1}
 *     and an identifier of "123".
 *
 * !!! note "Factory function"
 *     `create_tool_call` may also be used as a factory to create a
 *     `ToolCall`. Benefits include:
 *
 *     * Automatic ID generation (when not provided)
 *     * Required arguments strictly validated at creation time
 */
export interface LangchainCoreMessagesContentToolCall {
  /** Type */
  type: 'tool_call';
  /** Id */
  id: string | null;
  /** Name */
  name: string;
  /** Args */
  args: Record<string, any>;
  /** Index */
  index?: number | string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
}

/**
 * ToolCallChunk
 * A chunk of a tool call (yielded when streaming).
 *
 * When merging `ToolCallChunks` (e.g., via `AIMessageChunk.__add__`),
 * all string attributes are concatenated. Chunks are only merged if their
 * values of `index` are equal and not `None`.
 *
 * Example:
 * ```python
 * left_chunks = [ToolCallChunk(name="foo", args='{"a":', index=0)]
 * right_chunks = [ToolCallChunk(name=None, args="1}", index=0)]
 *
 * (
 *     AIMessageChunk(content="", tool_call_chunks=left_chunks)
 *     + AIMessageChunk(content="", tool_call_chunks=right_chunks)
 * ).tool_call_chunks == [ToolCallChunk(name="foo", args='{"a":1}', index=0)]
 * ```
 */
export interface LangchainCoreMessagesContentToolCallChunk {
  /** Type */
  type: 'tool_call_chunk';
  /** Id */
  id: string | null;
  /** Name */
  name: string | null;
  /** Args */
  args: string | null;
  /** Index */
  index?: number | string;
  /** Extras */
  extras?: Record<string, any>;
  [key: string]: any;
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
export interface LangchainCoreMessagesToolToolCall {
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
 * ToolCallChunk
 * A chunk of a tool call (yielded when streaming).
 *
 * When merging `ToolCallChunk`s (e.g., via `AIMessageChunk.__add__`),
 * all string attributes are concatenated. Chunks are only merged if their
 * values of `index` are equal and not None.
 *
 * Example:
 * ```python
 * left_chunks = [ToolCallChunk(name="foo", args='{"a":', index=0)]
 * right_chunks = [ToolCallChunk(name=None, args="1}", index=0)]
 *
 * (
 *     AIMessageChunk(content="", tool_call_chunks=left_chunks)
 *     + AIMessageChunk(content="", tool_call_chunks=right_chunks)
 * ).tool_call_chunks == [ToolCallChunk(name="foo", args='{"a":1}', index=0)]
 * ```
 */
export interface LangchainCoreMessagesToolToolCallChunk {
  /** Name */
  name: string | null;
  /** Args */
  args: string | null;
  /** Id */
  id: string | null;
  /** Index */
  index: number | null;
  /** Type */
  type?: 'tool_call_chunk';
  [key: string]: any;
}
