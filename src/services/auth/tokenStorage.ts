// services/auth/tokenStorage.ts
import { User, AuthResponse } from '../../types/auth';

export class TokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'lexik3_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'lexik3_refresh_token';
  private static readonly USER_DATA_KEY = 'lexik3_user_data';
  private static readonly TOKEN_EXPIRY_KEY = 'lexik3_token_expiry';

  // Store authentication data
  static storeAuthData(authResponse: AuthResponse): void {
    const { token, refreshToken, user, expiresAt } = authResponse;
    
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiresAt);
  }

  // Get access token
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Get user data
  static getUserData(): User | null {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Check if token is expired
  static isTokenExpired(): boolean {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    
    const expiryTime = new Date(expiry).getTime();
    const currentTime = new Date().getTime();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    
    return currentTime >= (expiryTime - bufferTime);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getUserData();
    return !!(token && user && !this.isTokenExpired());
  }

  // Clear all authentication data
  static clearAuthData(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }
}
