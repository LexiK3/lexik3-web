# LexiK3 Frontend - Unified Authentication System

## Overview

The LexiK3 web frontend now supports a unified authentication system that seamlessly handles both JWT and OAuth2 authentication methods. This provides users with flexible login options while maintaining a consistent user experience.

## 🔐 Authentication Methods

### 1. JWT Authentication (Traditional)
- **Use Case**: Direct email/password login
- **Flow**: Login form → JWT token → API access
- **Features**: Automatic token refresh, secure storage, session management

### 2. OAuth2 Authentication (Modern)
- **Use Case**: Third-party authentication, enterprise SSO
- **Flow**: OAuth2 provider → Authorization code → Access token → API access
- **Features**: Scope-based permissions, secure token management, enterprise integration

## 🏗️ Architecture

### Unified Authentication Service

The `UnifiedAuthService` provides a single interface for both authentication methods:

```typescript
export class UnifiedAuthService {
  // JWT Authentication
  static async loginWithJWT(credentials: LoginRequest): Promise<UnifiedAuthResponse>
  static async registerWithJWT(userData: RegisterRequest): Promise<User>
  
  // OAuth2 Authentication
  static async loginWithOAuth2(): Promise<void>
  static async handleOAuth2Callback(url: string): Promise<UnifiedAuthResponse>
  static async getClientCredentialsToken(scopes?: string[]): Promise<UnifiedAuthResponse>
  
  // Unified Operations
  static async refreshToken(): Promise<UnifiedAuthResponse>
  static async logout(): Promise<void>
  static isAuthenticated(): boolean
  static getCurrentUser(): User | null
  static async hasScope(scope: string): Promise<boolean>
  static async getScopes(): Promise<string[]>
}
```

### OAuth2 Service

The `OAuth2Service` handles OAuth2-specific operations:

```typescript
export class OAuth2Service {
  // OAuth2 Flows
  static generateAuthorizationUrl(state?: string): string
  static async exchangeCodeForToken(code: string, state?: string): Promise<OAuth2TokenResponse>
  static async getClientCredentialsToken(scopes?: string[]): Promise<OAuth2TokenResponse>
  static async refreshToken(refreshToken: string): Promise<OAuth2TokenResponse>
  
  // Token Management
  static async introspectToken(token: string): Promise<OAuth2TokenInfo>
  static async revokeToken(token: string): Promise<void>
  static async getUserInfo(accessToken: string): Promise<OAuth2UserInfo>
  static async hasScope(accessToken: string, scope: string): Promise<boolean>
  
  // Utilities
  static parseAuthorizationResponse(url: string): { code?: string; state?: string; error?: string }
  static generateState(): string
}
```

## 🎨 User Interface

### Login Form

The updated login form supports both authentication methods:

```tsx
const LoginForm: React.FC = () => {
  // JWT Login (Email/Password)
  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginUser(data));
    // Handle JWT login result
  };

  // OAuth2 Login (Third-party)
  const handleOAuth2Login = async () => {
    await UnifiedAuthService.loginWithOAuth2();
    // Redirects to OAuth2 provider
  };

  return (
    <Card className="max-w-md mx-auto">
      {/* Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Form fields */}
        <Button type="submit">Sign In with Email</Button>
      </form>

      {/* OAuth2 Login */}
      <div className="mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleOAuth2Login}
        >
          Sign in with OAuth2
        </Button>
      </div>
    </Card>
  );
};
```

### OAuth2 Callback Component

Handles OAuth2 callback and token exchange:

```tsx
const OAuth2Callback: React.FC = () => {
  useEffect(() => {
    const handleOAuth2Callback = async () => {
      try {
        const currentUrl = window.location.href;
        const authResponse = await UnifiedAuthService.handleOAuth2Callback(currentUrl);
        
        // Update Redux state
        dispatch(setUser(authResponse.user));
        dispatch(setIsAuthenticated(true));
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(err.message);
      }
    };

    handleOAuth2Callback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="large" />
      <p>Completing OAuth2 authentication...</p>
    </div>
  );
};
```

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5071

# OAuth2 Configuration
REACT_APP_OAUTH2_CLIENT_ID=lexik3-web-client
REACT_APP_OAUTH2_CLIENT_SECRET=lexik3-web-client-secret
REACT_APP_OAUTH2_REDIRECT_URI=http://localhost:3000/oauth2/callback
```

### OAuth2 Scopes

The frontend requests the following scopes by default:

```typescript
const SCOPES = [
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
```

## 🚀 Usage Examples

### JWT Authentication

#### Login with Email/Password
```typescript
import { UnifiedAuthService } from '../services/auth/unifiedAuthService';

const handleLogin = async (email: string, password: string) => {
  try {
    const authResponse = await UnifiedAuthService.loginWithJWT({
      email,
      password
    });
    
    // User is now authenticated
    console.log('User:', authResponse.user);
    console.log('Token:', authResponse.token);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

#### Register New User
```typescript
const handleRegister = async (userData: RegisterRequest) => {
  try {
    const user = await UnifiedAuthService.registerWithJWT(userData);
    console.log('User registered:', user);
    // Redirect to login page
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### OAuth2 Authentication

#### Initiate OAuth2 Login
```typescript
const handleOAuth2Login = async () => {
  try {
    await UnifiedAuthService.loginWithOAuth2();
    // User will be redirected to OAuth2 provider
  } catch (error) {
    console.error('OAuth2 login failed:', error);
  }
};
```

#### Handle OAuth2 Callback
```typescript
// This is handled automatically by the OAuth2Callback component
// The component extracts the authorization code from the URL
// and exchanges it for an access token
```

#### Client Credentials (Server-to-Server)
```typescript
const handleClientCredentials = async () => {
  try {
    const authResponse = await UnifiedAuthService.getClientCredentialsToken([
      'read:books',
      'read:words'
    ]);
    
    console.log('Client authenticated:', authResponse);
  } catch (error) {
    console.error('Client credentials failed:', error);
  }
};
```

### Unified Operations

#### Check Authentication Status
```typescript
const isUserAuthenticated = UnifiedAuthService.isAuthenticated();
const currentUser = UnifiedAuthService.getCurrentUser();
```

#### Check User Permissions
```typescript
const canReadBooks = await UnifiedAuthService.hasScope('read:books');
const canWriteProfile = await UnifiedAuthService.hasScope('write:profile');
```

#### Get Available Scopes
```typescript
const scopes = await UnifiedAuthService.getScopes();
console.log('Available scopes:', scopes);
```

#### Logout
```typescript
const handleLogout = async () => {
  try {
    await UnifiedAuthService.logout();
    // User is now logged out and redirected to login
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

## 🔄 Token Management

### Automatic Token Refresh

The API client automatically handles token refresh for both authentication methods:

```typescript
// services/api/client.ts
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        // Try to refresh token using unified auth service
        const authResponse = await UnifiedAuthService.refreshToken();
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${authResponse.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await UnifiedAuthService.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### Token Storage

Tokens are securely stored in localStorage with automatic cleanup:

```typescript
// services/auth/tokenStorage.ts
export class TokenStorage {
  static storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('lexik3_access_token', authResponse.token);
    localStorage.setItem('lexik3_refresh_token', authResponse.refreshToken);
    localStorage.setItem('lexik3_user_data', JSON.stringify(authResponse.user));
    localStorage.setItem('lexik3_token_expiry', authResponse.expiresAt);
  }

  static clearAuthData(): void {
    localStorage.removeItem('lexik3_access_token');
    localStorage.removeItem('lexik3_refresh_token');
    localStorage.removeItem('lexik3_user_data');
    localStorage.removeItem('lexik3_token_expiry');
    localStorage.removeItem('lexik3_auth_method');
  }
}
```

## 🛡️ Security Features

### CSRF Protection
- OAuth2 state parameter validation
- Secure random state generation
- State verification on callback

### Token Security
- Secure token storage in localStorage
- Automatic token cleanup on logout
- Token expiration checking
- Automatic token refresh

### Error Handling
- Comprehensive error handling for both auth methods
- User-friendly error messages
- Automatic fallback to login on auth failure

## 📱 Responsive Design

### Mobile-First Approach
- Responsive login form
- Touch-friendly OAuth2 buttons
- Mobile-optimized callback handling

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

## 🧪 Testing

### Unit Tests
```typescript
// Test JWT authentication
describe('UnifiedAuthService', () => {
  it('should login with JWT', async () => {
    const credentials = { email: 'test@example.com', password: 'password' };
    const result = await UnifiedAuthService.loginWithJWT(credentials);
    expect(result.method).toBe('JWT');
    expect(result.user.email).toBe('test@example.com');
  });

  it('should handle OAuth2 callback', async () => {
    const mockUrl = 'http://localhost:3000/oauth2/callback?code=abc123&state=xyz789';
    const result = await UnifiedAuthService.handleOAuth2Callback(mockUrl);
    expect(result.method).toBe('OAuth2');
  });
});
```

### Integration Tests
```typescript
// Test complete authentication flows
describe('Authentication Flow', () => {
  it('should complete JWT login flow', async () => {
    // Test registration → login → API access
  });

  it('should complete OAuth2 login flow', async () => {
    // Test OAuth2 redirect → callback → API access
  });
});
```

## 🚀 Deployment

### Build Configuration
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Configure environment variables
REACT_APP_API_URL=https://api.lexik3.com
REACT_APP_OAUTH2_CLIENT_ID=lexik3-web-client
REACT_APP_OAUTH2_CLIENT_SECRET=your-client-secret
REACT_APP_OAUTH2_REDIRECT_URI=https://app.lexik3.com/oauth2/callback
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Monitoring and Analytics

### Authentication Events
- Login attempts (success/failure)
- Authentication method usage
- Token refresh events
- Logout events
- Error tracking

### Performance Metrics
- Authentication response times
- Token refresh performance
- API call success rates
- User session duration

## 🔮 Future Enhancements

### Planned Features
- **Social Login**: Google, Facebook, GitHub integration
- **Biometric Authentication**: Fingerprint, face recognition
- **Hardware Security Keys**: FIDO2/WebAuthn support
- **Multi-factor Authentication**: SMS, TOTP, email verification
- **Remember Me**: Extended session management
- **Single Sign-On**: Enterprise SSO integration

### Advanced OAuth2 Features
- **PKCE Support**: Enhanced security for mobile apps
- **Device Flow**: Support for limited input devices
- **Dynamic Client Registration**: Automatic client setup
- **Token Exchange**: Advanced token exchange flows

## 🎯 Benefits

### For Users
- **Flexible Login**: Choose between email/password or OAuth2
- **Seamless Experience**: Automatic token management
- **Security**: Industry-standard security practices
- **Convenience**: Single sign-on with enterprise systems

### For Developers
- **Unified API**: Single interface for both auth methods
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error management
- **Testing**: Built-in testing utilities

### For Administrators
- **Monitoring**: Complete authentication analytics
- **Control**: Fine-grained permission management
- **Security**: Multiple security layers
- **Compliance**: Industry-standard implementations

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
