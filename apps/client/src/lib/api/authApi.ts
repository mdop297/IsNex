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

export interface UserResponseDto {
  /** @example "uuid-string" */
  id: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "johndoe" */
  username: string;
  /** @example "user" */
  role: string;
  /** @example true */
  isVerified: boolean;
}

export interface PaginatedUserResponseDto {
  data: UserResponseDto[];
  /** @example 1 */
  page: number;
  /** @example 10 */
  total: number;
}

export interface UserUpdateDto {
  /**
   * Mark user as verified
   * @example true
   */
  isVerified?: boolean;
}

export interface UserCreateDto {
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
}

export interface SignUpResponseDto {
  /** @example "a1b2c3d4" */
  userId: string;
  /** @example "User registered successfully. Please verify your email." */
  message: string;
}

export interface SigninDto {
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

export interface UserProfileResponseDto {
  /** @example "uuid-string" */
  id: string;
  /** @example "user@example.com" */
  email: string;
  /** @example "johndoe" */
  username: string;
  /** @example "user" */
  role: string;
  /** @example true */
  isVerified: boolean;
  /**
   * @format date-time
   * @example "2023-08-01T12:34:56.789Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2023-08-01T12:34:56.789Z"
   */
  updatedAt: string;
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
    getUsers: (page: number, params: RequestParams = {}) =>
      this.request<PaginatedUserResponseDto, any>({
        path: `/api/users`,
        method: 'GET',
        format: 'json',
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
      this.request<UserResponseDto, void>({
        path: `/api/users/by-id/${id}`,
        method: 'GET',
        format: 'json',
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
      this.request<UserResponseDto, void>({
        path: `/api/users/by-email/${email}`,
        method: 'GET',
        format: 'json',
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
      this.request<UserResponseDto, void>({
        path: `/api/users/by-username/${username}`,
        method: 'GET',
        format: 'json',
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
    updateUser: (id: string, data: UserUpdateDto, params: RequestParams = {}) =>
      this.request<UserResponseDto, void>({
        path: `/api/users/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        format: 'json',
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
      this.request<any, void>({
        path: `/api/users/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name CountUsers
     * @summary Count number of users
     * @request GET:/api/users/count
     */
    countUsers: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/api/users/count`,
        method: 'GET',
        format: 'json',
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
    signUp: (data: UserCreateDto, params: RequestParams = {}) =>
      this.request<SignUpResponseDto, any>({
        path: `/api/auth/signup`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
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
    login: (data: SigninDto, params: RequestParams = {}) =>
      this.request<UserResponseDto, any>({
        path: `/api/auth/signin`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
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
      this.request<UserProfileResponseDto, any>({
        path: `/api/auth/profile/${id}`,
        method: 'GET',
        format: 'json',
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
      this.request<UserResponseDto, any>({
        path: `/api/auth/me`,
        method: 'GET',
        format: 'json',
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
      this.request<any, any>({
        path: `/api/auth/signout`,
        method: 'POST',
        format: 'json',
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
      this.request<UserResponseDto, any>({
        path: `/api/auth/refresh`,
        method: 'POST',
        format: 'json',
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
      this.request<any, any>({
        path: `/api/auth/verify/${token}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
}
