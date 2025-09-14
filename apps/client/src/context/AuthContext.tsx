'use client';

import {
  authApi,
  LoginRequestSchema,
  LoginResponse,
  RefreshResponse,
  RegisterRequestSchema,
  User,
} from '@/lib/api/auth';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  refresh: () => Promise<RefreshResponse | null>;
  clearError: () => void;
  getAccessToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessTokenRef = useRef<string | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearError = () => setError(null);

  const getAccessToken = () => accessTokenRef.current;

  const setAccessToken = (token: string | null) => {
    accessTokenRef.current = token;

    if (token) {
      // Set up auto refresh 1 minute before token expires (14 minutes)
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }

      refreshIntervalRef.current = setInterval(
        async () => {
          console.log('Auto refreshing token...');
          await refresh();
        },
        14 * 60 * 1000,
      ); // 14 minutes
    } else {
      // Clear refresh interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      const refreshData = await authApi.refresh();

      setAccessToken(refreshData.accessToken);
      setUser(refreshData.user);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);

      // Clear memory token
      setAccessToken(null);

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
      clearError();
      const loginResponse: LoginResponse = await authApi.login(credentials);
      setAccessToken(loginResponse.accessToken);
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

      setAccessToken(loginResponse.accessToken);

      setUser(loginResponse.user);
      setIsAuthenticated(true);
      return loginResponse;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      window.dispatchEvent(new CustomEvent('auth:logout'));
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Logout failed:', err);
      } else console.error('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async (): Promise<RefreshResponse | null> => {
    try {
      setIsLoading(true);
      const refreshData = await authApi.refresh();

      setAccessToken(refreshData.accessToken);

      setUser(refreshData.user);
      setIsAuthenticated(true);
      setError(null);
      return refreshData;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Refresh failed:', err);
      } else console.error('Refresh failed');
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle automatic logout
  useEffect(() => {
    const handleAuthLogout = () => {
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError('Session expired');
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
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
        refresh,
        getAccessToken,
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
