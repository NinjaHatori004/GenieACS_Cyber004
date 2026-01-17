import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { api } from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  name: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Verify token and get user data
        await refreshUser();
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user: userData } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set user data
      setUser(userData);
      
      // Show success message
      toast.success('Login berhasil!');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login gagal. Silakan coba lagi.';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear token and user data
    localStorage.removeItem('token');
    setUser(null);
    
    // Clear all queries
    queryClient.clear();
    
    // Redirect to login page
    router.push('/auth/login');
    
    // Show success message
    toast.success('Anda telah berhasil logout');
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      // Decode token to check expiration
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decodedToken.exp < currentTime) {
        throw new Error('Token expired');
      }

      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Protect routes
  useEffect(() => {
    if (isLoading) return;
    
    const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    const isPublicPath = publicPaths.includes(router.pathname);
    
    if (!isAuthenticated && !isPublicPath) {
      router.push('/auth/login');
    } else if (isAuthenticated && isPublicPath) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router.pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
