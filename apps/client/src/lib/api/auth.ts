import { api } from './axios';
import { z } from 'zod';

// Request schemas
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterRequestSchema = z.object({
  // name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Response schemas
export const UserSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  role: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  user: UserSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const RegisterResponseSchema = UserSchema;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

export const RefreshResponseSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
});
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

//
// ---------- API METHODS ----------
//

export const authApi = {
  login: async (
    credentials: z.infer<typeof LoginRequestSchema>,
  ): Promise<LoginResponse> => {
    const body = LoginRequestSchema.parse(credentials);
    const response = await api.post('/api/auth/signin', body);

    return LoginResponseSchema.parse(response.data);
  },

  // Public: register
  register: async (
    payload: z.infer<typeof RegisterRequestSchema>,
  ): Promise<LoginResponse | undefined> => {
    try {
      const body = RegisterRequestSchema.parse(payload);
      const response = await api.post('/api/auth/signup', body);
      return LoginResponseSchema.parse(response.data);
    } catch (err) {
      throw err;
    }
  },

  // Protected: get current user
  // me: async (): Promise<User> => {
  //   const response = await secureApi.get('/api/auth/me');
  //   return UserSchema.parse(response.data);
  // },

  // Protected: logout
  logout: async (): Promise<void> => {
    await api.post('/api/auth/signout');
  },

  // Protected: refresh access token
  refresh: async (): Promise<RefreshResponse> => {
    const response = await api.post('/api/auth/refresh');
    return RefreshResponseSchema.parse(response.data);
  },
};
