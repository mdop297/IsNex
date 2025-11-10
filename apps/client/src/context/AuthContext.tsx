'use client';

import {
  authApi,
  LoginRequestSchema,
  LoginResponse,
  RefreshResponse,
  RegisterRequestSchema,
  RegisterResponse,
  User,
} from '@/lib/api/auth';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
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
  ) => Promise<RegisterResponse | undefined>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  refresh: () => Promise<RefreshResponse | null>;
  clearError: () => void;
  // verify: (token: string) => Promise<VerifyResponse>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearError = () => setError(null);

  const checkAuth = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      const refreshData = await authApi.refresh();

      setUser(refreshData.user);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);

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
  ): Promise<RegisterResponse | undefined> => {
    try {
      setIsLoading(true);
      const signupResponse: RegisterResponse | undefined =
        await authApi.register(payload);

      if (!signupResponse) return;

      if (signupResponse.status === 201) {
        toast.info('Please check your email to verify your account');
      }

      setIsAuthenticated(true);
      return signupResponse;
    } catch (err: unknown) {
      let message = 'Registration failed';

      // check if it's an AxiosError
      if (err instanceof AxiosError) {
        message = err.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      bc.postMessage('logout');
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
  const bc = new BroadcastChannel('auth');

  useEffect(() => {
    bc.onmessage = (event) => {
      if (event.data === 'logout') {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    return () => bc.close();
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
