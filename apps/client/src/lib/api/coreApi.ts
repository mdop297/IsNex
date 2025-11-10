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

/** Body_upload_file */
export interface BodyUploadFile {
  data: DocumentCreate;
  /**
   * File
   * @format binary
   */
  file: File;
}

/** ConversationCreate */
export interface ConversationCreate {
  /** User Id */
  user_id?: string | null;
  /**
   * Workspace Id
   * Associated workspace ID
   */
  workspace_id?: string | null;
  /**
   * Title
   * Title of the conversation
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

/** DocumentCreate */
export interface DocumentCreate {
  /** User Id */
  user_id?: string | null;
  /** Folder Id */
  folder_id?: string | null;
  /**
   * Name
   * @default "Untitled"
   */
  name?: string;
  /** File Url */
  file_url: string;
  /**
   * type of the file, only pdf for now
   * @default "pdf"
   */
  type?: FileType;
  /**
   * Num Pages
   * number of pages in the file
   */
  num_pages: number | null;
  /**
   * File Size
   * size of the file in bytes
   */
  file_size: string;
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
  embedding_status: Status;
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
  /** User Id */
  user_id?: string | null;
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
  /**
   * Parent Id
   * @format uuid
   */
  parent_id: string;
  /** Name */
  name: string;
  /** Path */
  path: string;
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

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || '',
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === 'object'
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== 'string'
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Core Service
 * @version 0.1.0
 *
 * Core Service for IsNex project
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags documents
     * @name UploadFile
     * @summary Upload File
     * @request POST:/api/v1/documents/
     */
    uploadFile: (data: BodyUploadFile, params: RequestParams = {}) =>
      this.request<DocumentResponse, HTTPValidationError>({
        path: `/api/v1/documents/`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags documents
     * @name GetDocumentMeta
     * @summary Get Document Meta
     * @request GET:/api/v1/documents/{id}
     */
    getDocumentMeta: (id: string, params: RequestParams = {}) =>
      this.request<DocumentResponse, HTTPValidationError>({
        path: `/api/v1/documents/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags documents
     * @name UpdateDocument
     * @summary Update Document
     * @request PATCH:/api/v1/documents/{id}
     */
    updateDocument: (
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
      }),

    /**
     * No description
     *
     * @tags documents
     * @name DeleteDocument
     * @summary Delete Document
     * @request DELETE:/api/v1/documents/{id}
     */
    deleteDocument: (id: string, params: RequestParams = {}) =>
      this.request<boolean, HTTPValidationError>({
        path: `/api/v1/documents/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags documents
     * @name LoadDocument
     * @summary Load Document
     * @request GET:/api/v1/documents/load/{id}
     */
    loadDocument: (id: string, params: RequestParams = {}) =>
      this.request<PresignedUrlResponse, HTTPValidationError>({
        path: `/api/v1/documents/load/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags documents
     * @name DownloadDocument
     * @summary Download Document
     * @request GET:/api/v1/documents/download/{id}
     */
    downloadDocument: (id: string, params: RequestParams = {}) =>
      this.request<PresignedUrlResponse, HTTPValidationError>({
        path: `/api/v1/documents/download/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags folders
     * @name GetAllFoldersByUser
     * @summary Get All Folders By User
     * @request GET:/api/v1/folders/
     */
    getAllFoldersByUser: (params: RequestParams = {}) =>
      this.request<FolderResponse[], any>({
        path: `/api/v1/folders/`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags folders
     * @name CreateFolder
     * @summary Create Folder
     * @request POST:/api/v1/folders/
     */
    createFolder: (data: FolderCreate, params: RequestParams = {}) =>
      this.request<FolderResponse, HTTPValidationError>({
        path: `/api/v1/folders/`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags folders
     * @name GetFolderById
     * @summary Get Folder By Id
     * @request GET:/api/v1/folders/{id}
     */
    getFolderById: (id: string, params: RequestParams = {}) =>
      this.request<FolderResponse, HTTPValidationError>({
        path: `/api/v1/folders/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags folders
     * @name UpdateFolder
     * @summary Update Folder
     * @request PATCH:/api/v1/folders/{id}
     */
    updateFolder: (
      id: string,
      data: FolderUpdate,
      params: RequestParams = {},
    ) =>
      this.request<FolderResponse, HTTPValidationError>({
        path: `/api/v1/folders/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags folders
     * @name DeleteFolder
     * @summary Delete Folder
     * @request DELETE:/api/v1/folders/{id}
     */
    deleteFolder: (id: string, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/api/v1/folders/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags highlights
     * @name CreateHighlight
     * @summary Create Highlight
     * @request POST:/api/v1/hls/
     */
    createHighlight: (data: HighlightCreate, params: RequestParams = {}) =>
      this.request<HighlightResponse, HTTPValidationError>({
        path: `/api/v1/hls/`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags highlights
     * @name UpdateHighlight
     * @summary Update Highlight
     * @request PATCH:/api/v1/hls/{id}
     */
    updateHighlight: (
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
      }),

    /**
     * No description
     *
     * @tags highlights
     * @name GetHighlightById
     * @summary Get Highlight By Id
     * @request GET:/api/v1/hls/{id}
     */
    getHighlightById: (id: string, params: RequestParams = {}) =>
      this.request<HighlightResponse, HTTPValidationError>({
        path: `/api/v1/hls/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags highlights
     * @name DeleteHighlight
     * @summary Delete Highlight
     * @request DELETE:/api/v1/hls/{id}
     */
    deleteHighlight: (id: string, params: RequestParams = {}) =>
      this.request<boolean, HTTPValidationError>({
        path: `/api/v1/hls/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags highlights
     * @name GetAllHighlightsByDocument
     * @summary Get All Highlights By Document
     * @request GET:/api/v1/hls/doc/{doc_id}
     */
    getAllHighlightsByDocument: (docId: string, params: RequestParams = {}) =>
      this.request<HighlightResponse[], HTTPValidationError>({
        path: `/api/v1/hls/doc/${docId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags highlights
     * @name GetAllHighlightsByUser
     * @summary Get All Highlights By User
     * @request GET:/api/v1/hls/user
     */
    getAllHighlightsByUser: (
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
      }),

    /**
     * No description
     *
     * @tags conversations
     * @name CreateConversation
     * @summary Create Conversation
     * @request POST:/api/v1/convs/
     */
    createConversation: (
      data: ConversationCreate,
      params: RequestParams = {},
    ) =>
      this.request<ConversationResponse, HTTPValidationError>({
        path: `/api/v1/convs/`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags conversations
     * @name UpdateConversation
     * @summary Update Conversation
     * @request PATCH:/api/v1/convs/{id}
     */
    updateConversation: (
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
      }),

    /**
     * No description
     *
     * @tags conversations
     * @name GetConversation
     * @summary Get Conversation
     * @request GET:/api/v1/convs/{id}
     */
    getConversation: (id: string, params: RequestParams = {}) =>
      this.request<ConversationResponse, HTTPValidationError>({
        path: `/api/v1/convs/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags conversations
     * @name DeleteConversation
     * @summary Delete Conversation
     * @request DELETE:/api/v1/convs/{id}
     */
    deleteConversation: (id: string, params: RequestParams = {}) =>
      this.request<boolean, HTTPValidationError>({
        path: `/api/v1/convs/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags conversations
     * @name GetAllConversations
     * @summary Get All Conversations
     * @request GET:/api/v1/convs/user
     */
    getAllConversations: (params: RequestParams = {}) =>
      this.request<PaginatedConversationResponse, any>({
        path: `/api/v1/convs/user`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags conversations
     * @name GetConversationsByWorkspace
     * @summary Get Conversations By Workspace
     * @request GET:/api/v1/convs/workspace/{workspace_id}
     */
    getConversationsByWorkspace: (
      workspaceId: string,
      params: RequestParams = {},
    ) =>
      this.request<PaginatedConversationResponse, HTTPValidationError>({
        path: `/api/v1/convs/workspace/${workspaceId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags messages
     * @name CreateMessage
     * @summary Create Message
     * @request POST:/api/v1/messages/
     */
    createMessage: (data: MessageCreate, params: RequestParams = {}) =>
      this.request<MessageResponse, HTTPValidationError>({
        path: `/api/v1/messages/`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags messages
     * @name UpdateMessae
     * @summary Update Messae
     * @request PATCH:/api/v1/messages/{id}
     */
    updateMessae: (
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
      }),

    /**
     * No description
     *
     * @tags messages
     * @name GetMessageById
     * @summary Get Message By Id
     * @request GET:/api/v1/messages/{id}
     */
    getMessageById: (id: string, params: RequestParams = {}) =>
      this.request<MessageResponse, HTTPValidationError>({
        path: `/api/v1/messages/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags messages
     * @name DeleteMessage
     * @summary Delete Message
     * @request DELETE:/api/v1/messages/{id}
     */
    deleteMessage: (id: string, params: RequestParams = {}) =>
      this.request<boolean, HTTPValidationError>({
        path: `/api/v1/messages/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags messages
     * @name GetMessagesOfConv
     * @summary Get Messages Of Conv
     * @request GET:/api/v1/messages/conv/{id}
     */
    getMessagesOfConv: (id: string, params: RequestParams = {}) =>
      this.request<MessageResponse[], HTTPValidationError>({
        path: `/api/v1/messages/conv/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags note
     * @name CreateNote
     * @summary Create Note
     * @request POST:/api/v1/note/
     */
    createNote: (data: NoteCreate, params: RequestParams = {}) =>
      this.request<NoteResponse, HTTPValidationError>({
        path: `/api/v1/note/`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags note
     * @name UpdateNote
     * @summary Update Note
     * @request PATCH:/api/v1/note/{id}
     */
    updateNote: (id: string, data: NoteUpdate, params: RequestParams = {}) =>
      this.request<NoteResponse, HTTPValidationError>({
        path: `/api/v1/note/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags note
     * @name GetNote
     * @summary Get Note
     * @request GET:/api/v1/note/{id}
     */
    getNote: (id: string, params: RequestParams = {}) =>
      this.request<NoteResponse, HTTPValidationError>({
        path: `/api/v1/note/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags note
     * @name DeleteNote
     * @summary Delete Note
     * @request DELETE:/api/v1/note/{id}
     */
    deleteNote: (id: string, params: RequestParams = {}) =>
      this.request<boolean, HTTPValidationError>({
        path: `/api/v1/note/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags note
     * @name GetAllNotesByUser
     * @summary Get All Notes By User
     * @request GET:/api/v1/note/all
     */
    getAllNotesByUser: (params: RequestParams = {}) =>
      this.request<NoteResponse[], any>({
        path: `/api/v1/note/all`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags noteblocks
     * @name CreateNoteblock
     * @summary Create Noteblock
     * @request POST:/api/v1/noteblocks/
     */
    createNoteblock: (data: NoteBlockCreate, params: RequestParams = {}) =>
      this.request<NoteBlockResponse, HTTPValidationError>({
        path: `/api/v1/noteblocks/`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags noteblocks
     * @name UpdateNoteblock
     * @summary Update Noteblock
     * @request PATCH:/api/v1/noteblocks/{id}
     */
    updateNoteblock: (
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
      }),

    /**
     * No description
     *
     * @tags noteblocks
     * @name DeleteNoteblock
     * @summary Delete Noteblock
     * @request DELETE:/api/v1/noteblocks/{id}
     */
    deleteNoteblock: (id: string, params: RequestParams = {}) =>
      this.request<boolean, HTTPValidationError>({
        path: `/api/v1/noteblocks/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags noteblocks
     * @name GetNoteblock
     * @summary Get Noteblock
     * @request GET:/api/v1/noteblocks/{id}
     */
    getNoteblock: (id: string, params: RequestParams = {}) =>
      this.request<NoteBlockResponse, HTTPValidationError>({
        path: `/api/v1/noteblocks/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags noteblocks
     * @name GetAllNoteblocksOfNote
     * @summary Get All Noteblocks Of Note
     * @request GET:/api/v1/noteblocks/note/{note_id}
     */
    getAllNoteblocksOfNote: (noteId: string, params: RequestParams = {}) =>
      this.request<NoteBlockResponse[], HTTPValidationError>({
        path: `/api/v1/noteblocks/note/${noteId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags prompts
     * @name GetAllPromptsByUser
     * @summary Get All Prompts By User
     * @request GET:/api/v1/prompts/
     */
    getAllPromptsByUser: (params: RequestParams = {}) =>
      this.request<PromptResponse[], any>({
        path: `/api/v1/prompts/`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags prompts
     * @name CreatePrompt
     * @summary Create Prompt
     * @request POST:/api/v1/prompts/
     */
    createPrompt: (data: PromptCreate, params: RequestParams = {}) =>
      this.request<PromptResponse, HTTPValidationError>({
        path: `/api/v1/prompts/`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags prompts
     * @name UpdatePrompt
     * @summary Update Prompt
     * @request PATCH:/api/v1/prompts/{id}
     */
    updatePrompt: (
      id: string,
      data: PromptUpdate,
      params: RequestParams = {},
    ) =>
      this.request<PromptResponse, HTTPValidationError>({
        path: `/api/v1/prompts/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags prompts
     * @name GetPromptById
     * @summary Get Prompt By Id
     * @request GET:/api/v1/prompts/{id}
     */
    getPromptById: (id: string, params: RequestParams = {}) =>
      this.request<PromptResponse, HTTPValidationError>({
        path: `/api/v1/prompts/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags prompts
     * @name DeletePrompt
     * @summary Delete Prompt
     * @request DELETE:/api/v1/prompts/{id}
     */
    deletePrompt: (id: string, params: RequestParams = {}) =>
      this.request<boolean, HTTPValidationError>({
        path: `/api/v1/prompts/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspace
     * @name GetAllWorkspacesByUser
     * @summary Get All Workspaces By User
     * @request GET:/api/v1/workspace/
     */
    getAllWorkspacesByUser: (params: RequestParams = {}) =>
      this.request<WorkspaceResponse[], void>({
        path: `/api/v1/workspace/`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspace
     * @name CreateWorkspace
     * @summary Create Workspace
     * @request POST:/api/v1/workspace/
     */
    createWorkspace: (data: WorkspaceCreate, params: RequestParams = {}) =>
      this.request<WorkspaceResponse, void | HTTPValidationError>({
        path: `/api/v1/workspace/`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspace
     * @name GetWorkspaceById
     * @summary Get Workspace By Id
     * @request GET:/api/v1/workspace/{workspace_id}
     */
    getWorkspaceById: (workspaceId: string, params: RequestParams = {}) =>
      this.request<WorkspaceResponse, void | HTTPValidationError>({
        path: `/api/v1/workspace/${workspaceId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspace
     * @name UpdateWorkspace
     * @summary Update Workspace
     * @request PATCH:/api/v1/workspace/{workspace_id}
     */
    updateWorkspace: (
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
      }),

    /**
     * No description
     *
     * @tags Workspace
     * @name DeleteWorkspace
     * @summary Delete Workspace
     * @request DELETE:/api/v1/workspace/{workspace_id}
     */
    deleteWorkspace: (workspaceId: string, params: RequestParams = {}) =>
      this.request<boolean, void | HTTPValidationError>({
        path: `/api/v1/workspace/${workspaceId}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspace
     * @name GetWorkspaceMeta
     * @summary Get Workspace Meta
     * @request GET:/api/v1/workspace/meta/{workspace_id}
     */
    getWorkspaceMeta: (workspaceId: string, params: RequestParams = {}) =>
      this.request<WorkspaceMetaResponse, void | HTTPValidationError>({
        path: `/api/v1/workspace/meta/${workspaceId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspace
     * @name AddDocumentToWorkspace
     * @summary Add Document To Workspace
     * @request POST:/api/v1/workspace/{workspace_id}/document/{document_id}
     */
    addDocumentToWorkspace: (
      workspaceId: string,
      documentId: string,
      params: RequestParams = {},
    ) =>
      this.request<WorkspaceResponse, void | HTTPValidationError>({
        path: `/api/v1/workspace/${workspaceId}/document/${documentId}`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Workspace
     * @name RemoveDocumentFromWorkspace
     * @summary Remove Document From Workspace
     * @request DELETE:/api/v1/workspace/{workspace_id}/document/{document_id}
     */
    removeDocumentFromWorkspace: (
      workspaceId: string,
      documentId: string,
      params: RequestParams = {},
    ) =>
      this.request<WorkspaceResponse, void | HTTPValidationError>({
        path: `/api/v1/workspace/${workspaceId}/document/${documentId}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),
  };
  showenv = {
    /**
     * No description
     *
     * @name Showenv
     * @summary Showenv
     * @request GET:/showenv
     */
    showenv: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/showenv`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
}
