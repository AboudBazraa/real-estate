import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface AuthState {
  user: any;
  isLoading: boolean;
  error: string;
}

const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: '',
  });
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: '' }));
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof AxiosError) {
        setState(prev => ({
          ...prev,
          error: error.response?.data?.message || 'Login failed',
          isLoading: false,
        }));
      }
    }
  };

  const register = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: '' }));
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        password,
      });
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof AxiosError) {
        setState(prev => ({
          ...prev,
          error: error.response?.data?.message || 'Registration failed',
          isLoading: false,
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
        isLoading: false,
      }));
    }
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
  };
};

export default useAuth;
