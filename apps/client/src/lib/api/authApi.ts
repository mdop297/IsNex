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

export interface UpdateUserDto {
  /**
   * User ID
   * @example "b5f5c19c-87d2-4f77-ae8c-2dbdca09b3cb"
   */
  id: string;
  /**
   * Mark user as verified
   * @example true
   */
  isVerified?: boolean;
}

export interface CreateUserDto {
  /**
   * User email address
   * @example "john@example.com"
   */
  email: string;
  /**
   * User password (min length 6 characters)
   * @minLength 6
   * @example "strongPassword123"
   */
  password: string;
  /**
   * Optional display name for the user
   * @example "JohnDoe"
   */
  username?: string;
  /**
   * Email verification status
   * @example false
   */
  isVerified?: boolean;
}

export interface LoginDto {
  /**
   * User email used for login
   * @example "john@example.com"
   */
  email: string;
  /**
   * User password (min length 6 characters)
   * @minLength 6
   * @example "strongPassword123"
   */
  password: string;
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
 * @title Cats example
 * @version 1.0
 * @contact
 *
 * The cats API description
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Users
     * @name GetUsers
     * @summary Get all users
     * @request GET:/api/users
     */
    getUsers: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name GetUserById
     * @summary Get user by ID
     * @request GET:/api/users/by-id/{id}
     */
    getUserById: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/by-id/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name GetUserByEmail
     * @summary Get user by email
     * @request GET:/api/users/by-email/{email}
     */
    getUserByEmail: (email: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/by-email/${email}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name GetUserByUsername
     * @summary Get user by username
     * @request GET:/api/users/by-username/{username}
     */
    getUserByUsername: (username: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/by-username/${username}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name FilterUsers
     * @summary Filter users by query
     * @request GET:/api/users/filter
     */
    filterUsers: (
      query?: {
        /** Filter by username */
        username?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/users/filter`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UpdateUser
     * @summary Update user by ID
     * @request PATCH:/api/users/{id}
     */
    updateUser: (id: string, data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name DeleteUser
     * @summary Delete user by ID
     * @request DELETE:/api/users/{id}
     */
    deleteUser: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/${id}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name SignUp
     * @summary Register a new user account
     * @request POST:/api/auth/signup
     */
    signUp: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/signup`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name Login
     * @summary Login and issue authentication tokens
     * @request POST:/api/auth/signin
     */
    login: (data: LoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/signin`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name GetProfile
     * @summary Get user profile by ID
     * @request GET:/api/auth/profile/{id}
     */
    getProfile: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/profile/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name WhoAmI
     * @summary Get current logged-in user information
     * @request GET:/api/auth/me
     */
    whoAmI: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/me`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name SignOut
     * @summary Sign out and clear authentication cookies
     * @request POST:/api/auth/signout
     */
    signOut: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/signout`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name RefreshToken
     * @summary Refresh access token using refresh token
     * @request POST:/api/auth/refresh
     */
    refreshToken: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/refresh`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name VerifyEmail
     * @summary Verify email confirmation token
     * @request GET:/api/auth/verify/{token}
     */
    verifyEmail: (token: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/verify/${token}`,
        method: 'GET',
        ...params,
      }),
  };
}
