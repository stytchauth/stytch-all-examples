import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/frontend/types';
import { authApi } from '@/frontend/lib/api';
import { createStytchB2BUIClient } from '@stytch/react/dist/b2b/index.ui';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const stytch = createStytchB2BUIClient(
  import.meta.env.VITE_STYTCH_PUBLIC_TOKEN || (window as any).APP_CONFIG?.VITE_STYTCH_PUBLIC_TOKEN || '',
);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.signin(email, password);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await authApi.signup(email, password, name);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    stytch.session.revoke();
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
