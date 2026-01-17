import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

// Create axios instance with base URL
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            refreshToken,
          });
          
          const { token, refreshToken: newRefreshToken } = response.data;
          
          // Update tokens in localStorage
          localStorage.setItem('token', token);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          
          // Update the Authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          
          // Retry the original request
          return api(originalRequest);
        } else {
          // No refresh token, log the user out
          const { logout } = useAuth();
          logout();
        }
      } catch (error) {
        // Refresh token failed, log the user out
        const { logout } = useAuth();
        logout();
        return Promise.reject(error);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.message || 'Terjadi kesalahan pada server';
      
      // Only show error toast if it's not a 401 (handled above)
      if (error.response.status !== 401) {
        toast.error(errorMessage);
      }
      
      return Promise.reject({
        status: error.response.status,
        message: errorMessage,
        data: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Tidak ada koneksi ke server. Silakan periksa koneksi internet Anda.');
      return Promise.reject({
        status: 0,
        message: 'No response from server',
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message,
      });
    }
  }
);

export default api;
