// services/__tests__/mockService.test.ts

// Mock axios before any imports
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  })),
  default: {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    }))
  }
}));

import { mockApiClient } from '../mock/mockApiClient';
import { getApiClient, isMockMode } from '../api/apiServiceFactory';
import { AuthService } from '../auth/authService';

// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
  process.env.REACT_APP_USE_MOCK_API = 'true';
});

afterEach(() => {
  process.env = originalEnv;
});

describe('Mock Service', () => {
  describe('Mock API Client', () => {
    it('should return mock data for books endpoint', async () => {
      const response = await mockApiClient.get('/api/books');
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.books).toBeDefined();
      expect(Array.isArray(response.data.data.books)).toBe(true);
    });

    it('should handle login with mock credentials', async () => {
      const response = await mockApiClient.post('/api/auth/login', {
        email: 'demo@lexik3.com',
        password: 'password123'
      });
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.user).toBeDefined();
      expect(response.data.data.token).toBeDefined();
    });

    it('should reject login with invalid credentials', async () => {
      await expect(
        mockApiClient.post('/api/auth/login', {
          email: 'demo@lexik3.com',
          password: 'wrongpassword'
        })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should handle user registration', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'New',
        lastName: 'User',
        acceptTerms: true
      };

      const response = await mockApiClient.post('/api/auth/register', userData);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.userId).toBeDefined();
    });
  });

  describe('Service Factory', () => {
    it('should use mock client when REACT_APP_USE_MOCK_API is true', () => {
      process.env.REACT_APP_USE_MOCK_API = 'true';
      
      // Re-import to get fresh environment
      jest.resetModules();
      const { isMockMode: freshIsMockMode } = require('../api/apiServiceFactory');
      
      expect(freshIsMockMode()).toBe(true);
    });

    it('should use real client when REACT_APP_USE_MOCK_API is false', () => {
      process.env.REACT_APP_USE_MOCK_API = 'false';
      
      // Re-import to get fresh environment
      jest.resetModules();
      const { isMockMode: freshIsMockMode } = require('../api/apiServiceFactory');
      
      expect(freshIsMockMode()).toBe(false);
    });
  });

  describe('Auth Service Integration', () => {
    beforeEach(() => {
      // Ensure mock mode is enabled for these tests
      process.env.REACT_APP_USE_MOCK_API = 'true';
      // Clear module cache to get fresh environment
      jest.resetModules();
    });

    it('should login successfully with mock service', async () => {
      // Re-import AuthService to get fresh environment
      const { AuthService: FreshAuthService } = await import('../auth/authService');
      
      const credentials = {
        email: 'demo@lexik3.com',
        password: 'password123'
      };

      const result = await FreshAuthService.login(credentials);
      
      expect(result.user.email).toBe('demo@lexik3.com');
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should register successfully with mock service', async () => {
      // Re-import AuthService to get fresh environment
      const { AuthService: FreshAuthService } = await import('../auth/authService');
      
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'Test',
        lastName: 'User',
        acceptTerms: true
      };

      const result = await FreshAuthService.register(userData);
      
      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('Test');
      expect(result.lastName).toBe('User');
    });
  });

  describe('No Real API Calls', () => {
    it('should not make real HTTP requests in mock mode', async () => {
      // Mock fetch to ensure no real requests are made
      const mockFetch = jest.fn();
      global.fetch = mockFetch;

      // This should use mock data, not make real requests
      await mockApiClient.get('/api/books');
      
      // Verify no real HTTP requests were made
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
