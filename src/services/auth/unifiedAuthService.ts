// services/auth/unifiedAuthService.ts
import { AuthService } from './authService';
import { OAuth2Service, OAuth2TokenResponse, OAuth2UserInfo } from './oauth2Service';
import { TokenStorage } from './tokenStorage';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth';

export type AuthMethod = 'JWT' | 'OAuth2';

export interface UnifiedAuthResponse {
  method: AuthMethod;
  token: string;
  refreshToken?: string;
  expiresAt: string;
  user: User;
  scopes?: string[];
}

export class UnifiedAuthService {
  private static readonly STORAGE_KEY_METHOD = 'lexik3_auth_method';

  /**
   * Login with JWT (traditional email/password)
   */
  static async loginWithJWT(credentials: LoginRequest): Promise<UnifiedAuthResponse> {
    try {
      const authData = await AuthService.login(credentials);
      
      // Store auth method
      localStorage.setItem(this.STORAGE_KEY_METHOD, 'JWT');
      
      return {
        method: 'JWT',
        token: authData.token,
        refreshToken: authData.refreshToken,
        expiresAt: authData.expiresAt,
        user: authData.user
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register with JWT (traditional email/password)
   */
  static async registerWithJWT(userData: RegisterRequest): Promise<User> {
    try {
      const user = await AuthService.register(userData);
      
      // Store auth method
      localStorage.setItem(this.STORAGE_KEY_METHOD, 'JWT');
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login with OAuth2 (authorization code flow)
   */
  static async loginWithOAuth2(): Promise<void> {
    try {
      // Generate state for CSRF protection
      const state = OAuth2Service.generateState();
      localStorage.setItem('oauth2_state', state);
      
      // Generate authorization URL
      const authUrl = OAuth2Service.generateAuthorizationUrl(state);
      
      // Redirect to OAuth2 provider
      window.location.href = authUrl;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle OAuth2 callback
   */
  static async handleOAuth2Callback(url: string): Promise<UnifiedAuthResponse> {
    try {
      const { code, state, error } = OAuth2Service.parseAuthorizationResponse(url);
      
      if (error) {
        throw new Error(`OAuth2 error: ${error}`);
      }
      
      if (!code) {
        throw new Error('No authorization code received');
      }
      
      // Verify state parameter
      const storedState = localStorage.getItem('oauth2_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }
      
      // Clean up state
      localStorage.removeItem('oauth2_state');
      
      // Exchange code for token
      const tokenResponse = await OAuth2Service.exchangeCodeForToken(code, state);
      
      // Get user info
      const userInfo = await OAuth2Service.getUserInfo(tokenResponse.access_token);
      
      // Convert OAuth2 user info to our User type
      const user: User = {
        id: userInfo.sub,
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        emailConfirmed: userInfo.email_verified,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      // Store authentication data
      const authData: AuthResponse = {
        token: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token || '',
        expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString(),
        user
      };
      
      TokenStorage.storeAuthData(authData);
      localStorage.setItem(this.STORAGE_KEY_METHOD, 'OAuth2');
      
      return {
        method: 'OAuth2',
        token: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: authData.expiresAt,
        user,
        scopes: tokenResponse.scope?.split(' ') || []
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get client credentials token (for server-to-server)
   */
  static async getClientCredentialsToken(scopes?: string[]): Promise<UnifiedAuthResponse> {
    try {
      const tokenResponse = await OAuth2Service.getClientCredentialsToken(scopes);
      
      // Create a system user for client credentials
      const user: User = {
        id: 'system',
        email: 'system@lexik3.com',
        firstName: 'System',
        lastName: 'User',
        emailConfirmed: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      // Store authentication data
      const authData: AuthResponse = {
        token: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token || '',
        expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString(),
        user
      };
      
      TokenStorage.storeAuthData(authData);
      localStorage.setItem(this.STORAGE_KEY_METHOD, 'OAuth2');
      
      return {
        method: 'OAuth2',
        token: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: authData.expiresAt,
        user,
        scopes: tokenResponse.scope?.split(' ') || []
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh token (works for both JWT and OAuth2)
   */
  static async refreshToken(): Promise<UnifiedAuthResponse> {
    try {
      const method = this.getCurrentAuthMethod();
      
      if (method === 'JWT') {
        const authData = await AuthService.refreshToken();
        return {
          method: 'JWT',
          token: authData.token,
          refreshToken: authData.refreshToken,
          expiresAt: authData.expiresAt,
          user: authData.user
        };
      } else if (method === 'OAuth2') {
        const refreshToken = TokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const tokenResponse = await OAuth2Service.refreshToken(refreshToken);
        
        // Get user info
        const userInfo = await OAuth2Service.getUserInfo(tokenResponse.access_token);
        
        // Convert OAuth2 user info to our User type
        const user: User = {
          id: userInfo.sub,
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          emailConfirmed: userInfo.email_verified,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        
        // Store authentication data
        const authData: AuthResponse = {
          token: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token || '',
          expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString(),
          user
        };
        
        TokenStorage.storeAuthData(authData);
        
        return {
          method: 'OAuth2',
          token: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          expiresAt: authData.expiresAt,
          user,
          scopes: tokenResponse.scope?.split(' ') || []
        };
      } else {
        throw new Error('Unknown authentication method');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout (works for both JWT and OAuth2)
   */
  static async logout(): Promise<void> {
    try {
      const method = this.getCurrentAuthMethod();
      
      if (method === 'JWT') {
        await AuthService.logout();
      } else if (method === 'OAuth2') {
        const token = TokenStorage.getAccessToken();
        if (token) {
          try {
            await OAuth2Service.revokeToken(token);
          } catch (error) {
            console.warn('Failed to revoke OAuth2 token:', error);
          }
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local data
      TokenStorage.clearAuthData();
      localStorage.removeItem(this.STORAGE_KEY_METHOD);
    }
  }

  /**
   * Get current authentication method
   */
  static getCurrentAuthMethod(): AuthMethod | null {
    return localStorage.getItem(this.STORAGE_KEY_METHOD) as AuthMethod | null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return TokenStorage.isAuthenticated();
  }

  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    return TokenStorage.getUserData();
  }

  /**
   * Check if user has required scope (OAuth2 only)
   */
  static async hasScope(scope: string): Promise<boolean> {
    const method = this.getCurrentAuthMethod();
    
    if (method === 'OAuth2') {
      const token = TokenStorage.getAccessToken();
      if (token) {
        return await OAuth2Service.hasScope(token, scope);
      }
    }
    
    // For JWT, assume all scopes are available
    return method === 'JWT';
  }

  /**
   * Get available scopes (OAuth2 only)
   */
  static async getScopes(): Promise<string[]> {
    const method = this.getCurrentAuthMethod();
    
    if (method === 'OAuth2') {
      const token = TokenStorage.getAccessToken();
      if (token) {
        try {
          const tokenInfo = await OAuth2Service.introspectToken(token);
          return tokenInfo.scopes;
        } catch (error) {
          console.warn('Failed to get scopes:', error);
        }
      }
    }
    
    // For JWT, return default scopes
    return method === 'JWT' ? [
      'read:profile',
      'write:profile',
      'read:user_data',
      'write:user_data',
      'read:learning',
      'write:learning',
      'read:progress',
      'write:progress',
      'read:books',
      'write:books',
      'enroll:books',
      'read:words',
      'write:words',
      'read:statistics'
    ] : [];
  }
}
