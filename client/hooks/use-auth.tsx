/**
 * Authentication Hook for ZLC Administrator
 * Manages authentication state and provides auth methods
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, LoginRequest } from '../../shared/api';
import { apiClient } from '../lib/api-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    if (!apiClient.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.getProfile();
      if (response.status === 'success' && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    console.log('🔵 Auth Hook - Iniciando login:', { email: credentials.email });
    setLoading(true);
    try {
      const response = await apiClient.login(credentials);
      console.log('🔵 Auth Hook - Respuesta:', response);
      
      if (response.status === 'success' && response.data?.user) {
        setUser(response.data.user);
        console.log('🔵 Auth Hook - Usuario autenticado:', response.data.user);
      } else {
        console.log('🔥 Auth Hook - Error en respuesta:', response);
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('🔥 Auth Hook - Error en login:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
