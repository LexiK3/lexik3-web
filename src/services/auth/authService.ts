// services/auth/authService.ts
import { getApiClient } from '../api/apiServiceFactory';
import { TokenStorage } from './tokenStorage';
import { IAuthService } from '../interfaces/IAuthService';
import { ErrorHandler } from '../error/ErrorHandler';
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

export class AuthService implements IAuthService {
  // Register new user
  static async register(userData: RegisterRequest): Promise<User> {
    try {
      const client = getApiClient();
      const response = await (client as any).post('/api/auth/register', userData) as AxiosResponse<ApiResponse<User>>;
      return response.data.data;
    } catch (error: unknown) {
      ErrorHandler.logError(error, 'AuthService.register');
      throw new Error(ErrorHandler.handleAuthError(error));
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
    } catch (error: unknown) {
      ErrorHandler.logError(error, 'AuthService.login');
      throw new Error(ErrorHandler.handleAuthError(error));
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
    } catch (error: unknown) {
      ErrorHandler.logError(error, 'AuthService.refreshToken');
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
    } catch (error: unknown) {
      ErrorHandler.logError(error, 'AuthService.logout');
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
    } catch (error: unknown) {
      ErrorHandler.logError(error, 'AuthService.changePassword');
      throw new Error(ErrorHandler.handleAuthError(error));
    }
  }

  // Forgot password
  static async forgotPassword(email: ForgotPasswordRequest): Promise<void> {
    try {
      const client = getApiClient();
      await (client as any).post('/api/auth/forgot-password', email);
    } catch (error: unknown) {
      ErrorHandler.logError(error, 'AuthService.forgotPassword');
      throw new Error(ErrorHandler.handleAuthError(error));
    }
  }

  // Reset password
  static async resetPassword(resetData: ResetPasswordRequest): Promise<void> {
    try {
      const client = getApiClient();
      await (client as any).post('/api/auth/reset-password', resetData);
    } catch (error: unknown) {
      ErrorHandler.logError(error, 'AuthService.resetPassword');
      throw new Error(ErrorHandler.handleAuthError(error));
    }
  }
}
