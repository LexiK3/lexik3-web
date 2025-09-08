// services/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '../../types/common';
import { getApiClient, isMockMode } from './apiServiceFactory';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5071',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API client is ready for real API calls

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lexik3_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('lexik3_refresh_token');
        if (refreshToken) {
          const refreshResponse = await axios.post<ApiResponse<any>>(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5071'}/api/auth/refresh`,
            { refreshToken }
          );

          const { token, refreshToken: newRefreshToken } = refreshResponse.data.data;
          localStorage.setItem('lexik3_access_token', token);
          localStorage.setItem('lexik3_refresh_token', newRefreshToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth data and redirect to login
        localStorage.removeItem('lexik3_access_token');
        localStorage.removeItem('lexik3_refresh_token');
        localStorage.removeItem('lexik3_user_data');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.data) {
      const apiError = error.response.data as ApiError;
      throw new Error(apiError.error.message || 'An error occurred');
    }

    return Promise.reject(error);
  }
);

export { apiClient };
