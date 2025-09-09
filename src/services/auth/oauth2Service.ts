// services/auth/oauth2Service.ts
import { apiClient } from '../api/client';
import { ApiResponse } from '../../types/common';

export interface OAuth2TokenRequest {
  grant_type: 'authorization_code' | 'client_credentials' | 'refresh_token';
  client_id: string;
  client_secret?: string;
  code?: string;
  redirect_uri?: string;
  refresh_token?: string;
  scope?: string;
}

export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  issued_at?: string;
}

export interface OAuth2TokenInfo {
  client_id: string;
  user_id: string;
  scopes: string[];
  issued_at: string;
  expires_at: string;
  is_active: boolean;
  token_type: string;
}

export interface OAuth2UserInfo {
  sub: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
}

export class OAuth2Service {
  private static readonly CLIENT_ID = process.env.REACT_APP_OAUTH2_CLIENT_ID || 'lexik3-web-client';
  private static readonly CLIENT_SECRET = process.env.REACT_APP_OAUTH2_CLIENT_SECRET || 'lexik3-web-client-secret';
  private static readonly REDIRECT_URI = process.env.REACT_APP_OAUTH2_REDIRECT_URI || `${window.location.origin}/oauth2/callback`;
  private static readonly SCOPES = [
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
  ].join(' ');

  /**
   * Generate OAuth2 authorization URL
   */
  static generateAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      scope: this.SCOPES,
      ...(state && { state })
    });

    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5071';
    return `${baseUrl}/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code: string, state?: string): Promise<OAuth2TokenResponse> {
    try {
      const request: OAuth2TokenRequest = {
        grant_type: 'authorization_code',
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        code,
        redirect_uri: this.REDIRECT_URI
      };

      const response = await apiClient.post<OAuth2TokenResponse>('/oauth2/token', 
        new URLSearchParams(request).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(this.handleOAuth2Error(error));
    }
  }

  /**
   * Get access token using client credentials
   */
  static async getClientCredentialsToken(scopes?: string[]): Promise<OAuth2TokenResponse> {
    try {
      const request: OAuth2TokenRequest = {
        grant_type: 'client_credentials',
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        scope: scopes?.join(' ') || this.SCOPES
      };

      const response = await apiClient.post<OAuth2TokenResponse>('/oauth2/token',
        new URLSearchParams(request).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(this.handleOAuth2Error(error));
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<OAuth2TokenResponse> {
    try {
      const request: OAuth2TokenRequest = {
        grant_type: 'refresh_token',
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        refresh_token: refreshToken
      };

      const response = await apiClient.post<OAuth2TokenResponse>('/oauth2/token',
        new URLSearchParams(request).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(this.handleOAuth2Error(error));
    }
  }

  /**
   * Introspect token
   */
  static async introspectToken(token: string): Promise<OAuth2TokenInfo> {
    try {
      const response = await apiClient.post<OAuth2TokenInfo>('/oauth2/introspect',
        new URLSearchParams({ token }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(this.handleOAuth2Error(error));
    }
  }

  /**
   * Revoke token
   */
  static async revokeToken(token: string): Promise<void> {
    try {
      await apiClient.post('/oauth2/revoke',
        new URLSearchParams({
          token,
          client_id: this.CLIENT_ID
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
    } catch (error: any) {
      throw new Error(this.handleOAuth2Error(error));
    }
  }

  /**
   * Get user info
   */
  static async getUserInfo(accessToken: string): Promise<OAuth2UserInfo> {
    try {
      const response = await apiClient.get<OAuth2UserInfo>('/oauth2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(this.handleOAuth2Error(error));
    }
  }

  /**
   * Check if user has required scope
   */
  static async hasScope(accessToken: string, scope: string): Promise<boolean> {
    try {
      const tokenInfo = await this.introspectToken(accessToken);
      return tokenInfo.scopes.includes(scope);
    } catch (error) {
      return false;
    }
  }

  /**
   * Handle OAuth2 errors
   */
  private static handleOAuth2Error(error: any): string {
    if (error.response?.data) {
      const { error: errorCode, error_description } = error.response.data;
      
      switch (errorCode) {
        case 'invalid_request':
          return 'Invalid request. Please check your parameters.';
        case 'invalid_client':
          return 'Invalid client credentials.';
        case 'invalid_grant':
          return 'Invalid authorization code or refresh token.';
        case 'unauthorized_client':
          return 'Client is not authorized to use this grant type.';
        case 'unsupported_grant_type':
          return 'Grant type is not supported.';
        case 'invalid_scope':
          return 'Invalid scope requested.';
        case 'access_denied':
          return 'Access denied by user.';
        case 'server_error':
          return 'OAuth2 server error. Please try again.';
        default:
          return error_description || 'OAuth2 authentication failed.';
      }
    }
    
    return 'Network error. Please check your connection.';
  }

  /**
   * Parse authorization response from URL
   */
  static parseAuthorizationResponse(url: string): { code?: string; state?: string; error?: string } {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    return {
      code: params.get('code') || undefined,
      state: params.get('state') || undefined,
      error: params.get('error') || undefined
    };
  }

  /**
   * Generate random state parameter for CSRF protection
   */
  static generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
