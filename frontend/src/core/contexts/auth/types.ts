/**
 * @module core/contexts/auth/types
 * @summary Type definitions for authentication context
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}
