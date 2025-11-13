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
