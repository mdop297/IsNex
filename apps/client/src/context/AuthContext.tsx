'use client';

import {
  authApi,
  LoginRequestSchema,
  LoginResponse,
  RegisterRequestSchema,
  User,
} from '@/lib/api/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import z from 'zod';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (
    credentials: z.infer<typeof LoginRequestSchema>,
  ) => Promise<LoginResponse | undefined>;
  register: (
    payload: z.infer<typeof RegisterRequestSchema>,
  ) => Promise<LoginResponse | undefined>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const checkAuth = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userData = await authApi.me();
      setUser(userData);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    credentials: z.infer<typeof LoginRequestSchema>,
  ): Promise<LoginResponse | undefined> => {
    try {
      setIsLoading(true);
      const loginResponse: LoginResponse = await authApi.login(credentials);
      setUser(loginResponse.user);
      setIsAuthenticated(true);
      return loginResponse;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Login failed');
      } else {
        setError('Login failed');
      }
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    payload: z.infer<typeof RegisterRequestSchema>,
  ): Promise<LoginResponse | undefined> => {
    try {
      setIsLoading(true);
      const loginResponse: LoginResponse = await authApi.register(payload);
      setUser(loginResponse.user);
      setIsAuthenticated(true);
      return loginResponse;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Registration failed');
      } else setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Logout failed:', err);
      } else console.error('Logout failed');
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        checkAuth,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
