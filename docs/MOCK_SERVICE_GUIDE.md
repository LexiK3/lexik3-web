# LexiK3 Mock Service Guide

## 📋 Overview

The LexiK3 web application includes a comprehensive mock service system that completely prevents any real API calls from being sent when enabled. This allows for full development and testing without requiring a backend API.

## 🚫 No API Calls Guarantee

When mock mode is enabled, **NO real HTTP requests will be made** to any external API. The system is designed with multiple layers of protection:

1. **Service Factory Pattern**: Automatically switches between mock and real clients
2. **Axios Method Override**: Blocks all HTTP methods when in mock mode
3. **Environment Configuration**: Centralized control over mock vs real API usage
4. **Console Warnings**: Clear logging when API calls are blocked

## 🔧 Configuration

### Environment Variables

Create a `.env.development` file in the project root:

```env
# Mock API Configuration
REACT_APP_USE_MOCK_API=true
REACT_APP_MOCK_DELAY=500
REACT_APP_MOCK_ERROR_RATE=0.1

# API Configuration (not used when mock is enabled)
REACT_APP_API_URL=https://api.lexik3.com/v1
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

### Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_USE_MOCK_API` | `true` in development | Enable/disable mock API |
| `REACT_APP_MOCK_DELAY` | `500` | Mock response delay in ms |
| `REACT_APP_MOCK_ERROR_RATE` | `0.1` | Probability of mock errors (0-1) |
| `REACT_APP_API_URL` | `https://api.lexik3.com/v1` | Real API URL (unused in mock mode) |

## 🏗️ Architecture

### Service Factory Pattern

```typescript
// services/api/apiServiceFactory.ts
export const getApiClient = () => apiServiceFactory.getClient();
export const isMockMode = () => apiServiceFactory.isUsingMockApi();
```

The factory automatically selects the appropriate client based on configuration.

### Mock Client Implementation

```typescript
// services/mock/mockApiClient.ts
export class MockApiClient {
  // Implements all HTTP methods (GET, POST, PUT, DELETE)
  // Provides realistic mock responses
  // Simulates network delays and errors
}
```

### API Call Blocking

```typescript
// services/api/client.ts
apiClient.get = async function<T>(url: string, config?: AxiosRequestConfig) {
  if (isMockMode()) {
    console.warn('🚫 API call blocked in mock mode:', 'GET', url);
    throw new Error('API calls are disabled in mock mode. Use the mock client instead.');
  }
  return originalGet<T>(url, config);
};
```

## 📊 Mock Data

### Comprehensive Data Store

The mock service includes realistic data for all major entities:

- **Users**: Multiple user profiles with different preferences
- **Books**: Vocabulary books with progress tracking
- **Learning Sessions**: Complete session management
- **Progress**: User statistics and achievements
- **Achievements**: Unlockable rewards system

### Data Persistence

Mock data persists during the browser session and can be modified through the UI, providing a realistic development experience.

## 🔄 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Mock Response |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | Returns mock JWT token |
| POST | `/api/auth/register` | User registration | Creates new mock user |
| POST | `/api/auth/refresh` | Token refresh | Returns new mock tokens |
| POST | `/api/auth/logout` | User logout | Clears mock session |
| GET | `/api/auth/profile` | Get user profile | Returns mock user data |

### Books Endpoints

| Method | Endpoint | Description | Mock Response |
|--------|----------|-------------|---------------|
| GET | `/api/books` | List books | Returns paginated book list |
| GET | `/api/books/{id}` | Get book details | Returns specific book |
| POST | `/api/books/{id}/enroll` | Enroll in book | Updates enrollment status |
| DELETE | `/api/books/{id}/enroll` | Unenroll from book | Removes enrollment |

### Learning Endpoints

| Method | Endpoint | Description | Mock Response |
|--------|----------|-------------|---------------|
| POST | `/api/learning-sessions` | Start session | Creates new mock session |
| POST | `/api/learning-sessions/{id}/answers` | Submit answer | Processes mock answer |
| POST | `/api/learning-sessions/{id}/complete` | Complete session | Finalizes mock session |

### Progress Endpoints

| Method | Endpoint | Description | Mock Response |
|--------|----------|-------------|---------------|
| GET | `/api/progress` | Get user progress | Returns mock statistics |
| GET | `/api/achievements` | Get achievements | Returns mock achievements |

## 🎯 Usage Examples

### Basic Service Usage

```typescript
import { getApiClient } from '../services/api/apiServiceFactory';

// This will automatically use mock or real client based on configuration
const client = getApiClient();

// All these calls will be mocked when REACT_APP_USE_MOCK_API=true
const response = await client.get('/api/books');
const loginResponse = await client.post('/api/auth/login', credentials);
```

### Authentication Service

```typescript
import { AuthService } from '../services/auth/authService';

// These methods automatically use the appropriate client
const user = await AuthService.login({ email: 'demo@lexik3.com', password: 'password123' });
const newUser = await AuthService.register(userData);
```

### Checking Mock Mode

```typescript
import { isMockMode } from '../services/api/apiServiceFactory';

if (isMockMode()) {
  console.log('Running in mock mode - no real API calls');
} else {
  console.log('Running in real API mode');
}
```

## 🧪 Testing with Mock Service

### Unit Tests

```typescript
// Enable mock mode for tests
process.env.REACT_APP_USE_MOCK_API = 'true';

import { AuthService } from '../services/auth/authService';

describe('AuthService', () => {
  it('should login with mock data', async () => {
    const result = await AuthService.login({
      email: 'demo@lexik3.com',
      password: 'password123'
    });
    
    expect(result.user.email).toBe('demo@lexik3.com');
    expect(result.token).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// Mock mode is automatically enabled in test environment
import { render, screen } from '@testing-library/react';
import { LoginForm } from '../components/auth/LoginForm';

test('login form works with mock API', async () => {
  render(<LoginForm />);
  
  // Fill form and submit
  // Mock API will handle the request
  // No real network calls will be made
});
```

## 🔍 Debugging

### Console Logging

When `REACT_APP_DEBUG=true`, the mock service provides detailed logging:

```
🔧 Environment Configuration: {
  useMockApi: true,
  mockDelay: 500,
  mockErrorRate: 0.1,
  apiUrl: "https://api.lexik3.com/v1",
  environment: "development"
}
🚫 Mock API Mode: No real API calls will be made
```

### API Call Blocking Warnings

When an API call is attempted in mock mode:

```
🚫 API call blocked in mock mode: GET /api/books
Error: API calls are disabled in mock mode. Use the mock client instead.
```

### Network Tab Verification

In the browser's Network tab, you should see **NO** requests to external APIs when mock mode is enabled. All data comes from the mock client.

## 🚀 Switching Between Mock and Real API

### Development Mode (Mock)

```env
REACT_APP_USE_MOCK_API=true
```

### Production Mode (Real API)

```env
REACT_APP_USE_MOCK_API=false
REACT_APP_API_URL=https://api.lexik3.com/v1
```

### Runtime Switching

```typescript
import { apiServiceFactory } from '../services/api/apiServiceFactory';

// Switch to real API at runtime
apiServiceFactory.updateConfig({ useMockApi: false });

// Switch back to mock API
apiServiceFactory.updateConfig({ useMockApi: true });
```

## 📈 Performance

### Mock Response Times

- **GET requests**: 300-500ms delay
- **POST requests**: 500-800ms delay
- **PUT requests**: 400-600ms delay
- **DELETE requests**: 300-500ms delay

### Memory Usage

Mock data is stored in memory and persists for the browser session. Memory usage is minimal and scales with the amount of mock data.

## 🔒 Security

### No External Requests

When mock mode is enabled, the application makes **zero** external HTTP requests. This provides:

- Complete offline development capability
- No risk of accidental API calls during development
- Consistent testing environment
- No dependency on external services

### Data Isolation

Mock data is completely isolated from any real data and cannot affect production systems.

## 🛠️ Customization

### Adding New Mock Endpoints

1. Add the endpoint handler to `MockApiClient`
2. Implement the mock response logic
3. Add mock data if needed
4. Test the endpoint

### Modifying Mock Data

Edit the `MockDataStore` class in `mockApiClient.ts` to customize the mock data:

```typescript
// Add new mock users
this.users.push({
  id: 'new-user-id',
  email: 'new@example.com',
  // ... other user properties
});
```

### Custom Error Scenarios

Modify the mock client to simulate different error conditions:

```typescript
// Simulate network errors
if (Math.random() < this.config.mockErrorRate) {
  throw this.createError('Simulated network error', 500);
}
```

## 📚 Best Practices

### 1. Always Use the Service Factory

```typescript
// ✅ Good
const client = getApiClient();

// ❌ Bad - bypasses mock system
const client = apiClient;
```

### 2. Check Mock Mode in Components

```typescript
import { isMockMode } from '../services/api/apiServiceFactory';

const MyComponent = () => {
  if (isMockMode()) {
    return <div>Running in mock mode</div>;
  }
  return <div>Running with real API</div>;
};
```

### 3. Use Environment Variables

Always use environment variables for configuration rather than hardcoding values.

### 4. Test Both Modes

Ensure your application works correctly in both mock and real API modes.

## 🐛 Troubleshooting

### Mock Mode Not Working

1. Check environment variables are set correctly
2. Verify `REACT_APP_USE_MOCK_API=true`
3. Check console for configuration logs
4. Ensure you're using `getApiClient()` instead of direct `apiClient`

### API Calls Still Being Made

1. Check if any code is using `apiClient` directly
2. Verify all services are using `getApiClient()`
3. Check for any direct axios usage
4. Look for console warnings about blocked API calls

### Mock Data Not Persisting

Mock data persists only during the browser session. To persist across sessions, implement localStorage integration in the `MockDataStore`.

## 📝 Conclusion

The LexiK3 mock service provides a complete, realistic development environment that guarantees no real API calls are made when enabled. This system allows for:

- **Safe Development**: No risk of affecting production systems
- **Offline Development**: Work without internet connection
- **Consistent Testing**: Predictable mock responses
- **Easy Switching**: Simple configuration to switch between mock and real API

The mock service is production-ready and provides all the functionality needed for full application development and testing.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
