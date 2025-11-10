import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface User {
  id: string;
  email: string;
  name?: string;
  token: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('@movie_app_token');
      const userData = await AsyncStorage.getItem('@movie_app_user');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        setUser({ ...user, token });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll create a mock user
      // In a real app, you'd authenticate with your backend/Firebase
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        token: `token_${email}_${Date.now()}`
      };

      setUser(mockUser);
      
      // Store auth data
      await AsyncStorage.setItem('@movie_app_token', mockUser.token);
      await AsyncStorage.setItem('@movie_app_user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      await AsyncStorage.removeItem('@movie_app_token');
      await AsyncStorage.removeItem('@movie_app_user');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll create a mock user
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        token: `token_${email}_${Date.now()}`
      };

      setUser(mockUser);
      
      // Store auth data
      await AsyncStorage.setItem('@movie_app_token', mockUser.token);
      await AsyncStorage.setItem('@movie_app_user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
