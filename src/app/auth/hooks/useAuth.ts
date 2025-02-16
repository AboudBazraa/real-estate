'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import  Roles  from '@/app/auth/types/roles';

interface AuthState {
  user: {
    id: string;
    email: string;
    role: Roles;
  } | null;
  isLoading: boolean;
  error: string;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: '',
  });
  const router = useRouter();

  const decodeRole = (token: string): Roles | null => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.role as Roles;
    } catch (error) {
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: '' }));
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      const token = response.data.token;
      const role = decodeRole(token);
      
      if (!role) {
        throw new Error('No role assigned to user');
      }

      setState(prev => ({
        ...prev,
        user: {
          id: response.data.user?.id || '',
          email: response.data.user?.email || '',
          role: role
        },
        isLoading: false
      }));
      localStorage.setItem('authToken', token);
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof AxiosError) {
        setState(prev => ({
          ...prev,
          error: error.response?.data?.message || 'Login failed',
          isLoading: false
        }));
      }
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: '' }));
    try {
      localStorage.removeItem('authToken');
      router.push('/auth');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Logout failed',
        isLoading: false
      }));
    }
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
  };
};

export default useAuth;
