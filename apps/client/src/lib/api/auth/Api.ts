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
  PaginatedUserResponseDto,
  SignUpResponseDto,
  SigninDto,
  UserCreateDto,
  UserProfileResponseDto,
  UserResponseDto,
  UserUpdateDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Users
   * @name GetUsers
   * @summary Get all users
   * @request GET:/api/users
   */
  getUsers = (page: number, params: RequestParams = {}) =>
    this.request<PaginatedUserResponseDto, any>({
      path: `/api/users`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name GetUserById
   * @summary Get user by ID
   * @request GET:/api/users/by-id/{id}
   */
  getUserById = (id: string, params: RequestParams = {}) =>
    this.request<UserResponseDto, void>({
      path: `/api/users/by-id/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name GetUserByEmail
   * @summary Get user by email
   * @request GET:/api/users/by-email/{email}
   */
  getUserByEmail = (email: string, params: RequestParams = {}) =>
    this.request<UserResponseDto, void>({
      path: `/api/users/by-email/${email}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name GetUserByUsername
   * @summary Get user by username
   * @request GET:/api/users/by-username/{username}
   */
  getUserByUsername = (username: string, params: RequestParams = {}) =>
    this.request<UserResponseDto, void>({
      path: `/api/users/by-username/${username}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UpdateUser
   * @summary Update user by ID
   * @request PATCH:/api/users/{id}
   */
  updateUser = (id: string, data: UserUpdateDto, params: RequestParams = {}) =>
    this.request<UserResponseDto, void>({
      path: `/api/users/${id}`,
      method: 'PATCH',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name DeleteUser
   * @summary Delete user by ID
   * @request DELETE:/api/users/{id}
   */
  deleteUser = (id: string, params: RequestParams = {}) =>
    this.request<any, void>({
      path: `/api/users/${id}`,
      method: 'DELETE',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name CountUsers
   * @summary Count number of users
   * @request GET:/api/users/count
   */
  countUsers = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/api/users/count`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name SignUp
   * @summary Register a new user account
   * @request POST:/api/auth/signup
   */
  signUp = (data: UserCreateDto, params: RequestParams = {}) =>
    this.request<SignUpResponseDto, any>({
      path: `/api/auth/signup`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name SignIn
   * @summary Login and issue authentication tokens
   * @request POST:/api/auth/signin
   */
  signIn = (data: SigninDto, params: RequestParams = {}) =>
    this.request<UserResponseDto, any>({
      path: `/api/auth/signin`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name GetProfile
   * @summary Get user profile by ID
   * @request GET:/api/auth/profile/{id}
   */
  getProfile = (id: string, params: RequestParams = {}) =>
    this.request<UserProfileResponseDto, any>({
      path: `/api/auth/profile/${id}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name WhoAmI
   * @summary Get current logged-in user information
   * @request GET:/api/auth/me
   */
  whoAmI = (params: RequestParams = {}) =>
    this.request<UserResponseDto, any>({
      path: `/api/auth/me`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name SignOut
   * @summary Sign out and clear authentication cookies
   * @request POST:/api/auth/signout
   */
  signOut = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/api/auth/signout`,
      method: 'POST',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name RefreshToken
   * @summary Refresh access token using refresh token
   * @request POST:/api/auth/refresh
   */
  refreshToken = (params: RequestParams = {}) =>
    this.request<UserResponseDto, any>({
      path: `/api/auth/refresh`,
      method: 'POST',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name VerifyEmail
   * @summary Verify email confirmation token
   * @request GET:/api/auth/verify/{token}
   */
  verifyEmail = (token: string, params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/api/auth/verify/${token}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
}
