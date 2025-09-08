// services/auth/authService.ts
import { getApiClient } from '../api/apiServiceFactory';
import { TokenStorage } from './tokenStorage';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  RefreshTokenRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../../types/auth';
import { ApiResponse } from '../../types/common';
import { AxiosResponse } from 'axios';

export class AuthService {
  // Register new user
  static async register(userData: RegisterRequest): Promise<User> {
    try {
      const client = getApiClient();
      const response = await (client as any).post('/api/auth/register', userData) as AxiosResponse<ApiResponse<User>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleAuthError(error));
    }
  }

  // Login user
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const client = getApiClient();
      const response = await (client as any).post('/api/auth/login', credentials) as AxiosResponse<ApiResponse<AuthResponse>>;
      const authData = response.data.data;
      
      // Store authentication data
      TokenStorage.storeAuthData(authData);
      
      return authData;
    } catch (error: any) {
      throw new Error(this.handleAuthError(error));
    }
  }

  // Refresh access token
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = TokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const client = getApiClient();
      const response = await (client as any).post('/api/auth/refresh', {
        refreshToken
      }) as AxiosResponse<ApiResponse<AuthResponse>>;
      
      const authData = response.data.data;
      TokenStorage.storeAuthData(authData);
      
      return authData;
    } catch (error: any) {
      // If refresh fails, clear auth data and redirect to login
      TokenStorage.clearAuthData();
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      const client = getApiClient();
      await (client as any).post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenStorage.clearAuthData();
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return TokenStorage.getUserData();
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return TokenStorage.isAuthenticated();
  }

  // Change password
  static async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    try {
      const client = getApiClient();
      await (client as any).post('/api/auth/change-password', passwordData);
    } catch (error: any) {
      throw new Error(this.handleAuthError(error));
    }
  }

  // Forgot password
  static async forgotPassword(email: ForgotPasswordRequest): Promise<void> {
    try {
      const client = getApiClient();
      await (client as any).post('/api/auth/forgot-password', email);
    } catch (error: any) {
      throw new Error(this.handleAuthError(error));
    }
  }

  // Reset password
  static async resetPassword(resetData: ResetPasswordRequest): Promise<void> {
    try {
      const client = getApiClient();
      await (client as any).post('/api/auth/reset-password', resetData);
    } catch (error: any) {
      throw new Error(this.handleAuthError(error));
    }
  }

  // Handle authentication errors
  private static handleAuthError(error: any): string {
    if (error.response?.data?.error) {
      const { code, message } = error.response.data.error;
      
      switch (code) {
        case 'VALIDATION_ERROR':
          return 'Please check your input and try again.';
        case 'AUTHENTICATION_FAILED':
          return 'Invalid email or password.';
        case 'CONFLICT':
          return 'An account with this email already exists.';
        case 'RATE_LIMITED':
          return 'Too many attempts. Please wait a moment.';
        case 'TOKEN_EXPIRED':
          return 'Your session has expired. Please log in again.';
        default:
          return message || 'Authentication failed. Please try again.';
      }
    }
    
    return 'Network error. Please check your connection.';
  }
}
