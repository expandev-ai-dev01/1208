/**
 * @component AuthProvider
 * @summary Provides authentication context to the application
 * @domain core
 * @type context-provider
 */

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContext } from './context';
import type { User, AuthContextValue } from './types';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: '1',
        email,
        name: 'User',
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock-token');
      return mockUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_token');
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
