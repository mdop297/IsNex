'use client';

import { Api } from '@/lib/api/auth/Api';
import {
  SigninDto,
  SignUpResponseDto,
  UserCreateDto,
  UserResponseDto,
} from '@/lib/api/auth/data-contracts';
import { routes } from '@/lib/constants';
import { HttpStatusCode } from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const authApi = new Api({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  baseApiParams: {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

type AuthContextType = {
  user: UserResponseDto | null;
  // setUser: (user: UserResponseDto | null) => void;
  loading: boolean;
  error: string | null;
  // setError: (error: string | null) => void;
  signIn: (data: SigninDto) => Promise<UserResponseDto>;
  signUp: (data: UserCreateDto) => Promise<SignUpResponseDto>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<UserResponseDto>;
  // clearError: () => void;
  // verifyEmail: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserResponseDto | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Handle automatic logout
  const bc = new BroadcastChannel('auth');

  useEffect(() => {
    bc.onmessage = (event) => {
      if (event.data === 'logout') {
        setUser(null);
      }
    };
    return () => bc.close();
  }, []);

  useEffect(() => {
    if (user) {
      refreshIntervalRef.current = setInterval(
        () => {
          refreshToken();
        },
        1000 * 60 * 60 * 5,
      );
    } else if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [user]);

  // XÓA useEffect load user từ localStorage (đã move vào useState initializer)
  // useEffect(() => {
  //   const savedUser = localStorage.getItem('user');
  //   if (savedUser) {
  //     setUser(JSON.parse(savedUser));
  //   }
  //   setLoading(false);
  // }, []);

  // sync user with local storage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      router.push(routes.SIGNIN);
    }
  }, [user]);

  const signIn = async (data: SigninDto): Promise<UserResponseDto> => {
    try {
      setLoading(true);
      const response = await authApi.signIn(data);
      if (response.status === HttpStatusCode.Created) {
        setUser(response.data);
        router.push(routes.HOME);
      }
      return response.data;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: UserCreateDto): Promise<SignUpResponseDto> => {
    try {
      setLoading(true);
      const response = await authApi.signUp(data);
      if (response.status === HttpStatusCode.Created) {
        toast.success('Please check your email to verify your account', {
          duration: 60000,
          position: 'top-center',
        });
      }
      return response.data;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authApi.signOut();
      bc.postMessage('logout');
      setUser(null);
      setError(null);
      window.dispatchEvent(new CustomEvent('auth:logout'));
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Logout failed:', err);
      } else console.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<UserResponseDto> => {
    try {
      const response = await authApi.refreshToken();
      setUser(response.data);
      return response.data;
    } catch (err) {
      setUser(null);
      return Promise.reject(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        refreshToken,
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
