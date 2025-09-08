// services/__tests__/authService.test.ts
import { AuthService } from '../auth/authService';
import { getApiClient } from '../api/apiServiceFactory';

// Mock the API client
jest.mock('../api/apiServiceFactory', () => ({
  getApiClient: jest.fn(),
}));

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
}));

describe('AuthService', () => {
  const mockApiClient = {
    post: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getApiClient as jest.Mock).mockReturnValue(mockApiClient);
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          data: {
            token: 'mock-token',
            refreshToken: 'mock-refresh-token',
            user: {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
            },
            expiresAt: '2024-12-31T23:59:59Z',
          },
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.login(mockCredentials);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/auth/login', mockCredentials);
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should handle login errors gracefully', async () => {
      const mockCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockError = {
        response: {
          data: {
            error: {
              code: 'AUTHENTICATION_FAILED',
              message: 'Invalid email or password',
            },
          },
        },
      };

      mockApiClient.post.mockRejectedValue(mockError);

      await expect(AuthService.login(mockCredentials)).rejects.toThrow('Invalid email or password');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUserData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        confirmPassword: 'password123',
        acceptTerms: true,
      };

      const mockResponse = {
        data: {
          data: {
            id: '2',
            email: 'newuser@example.com',
            name: 'New User',
          },
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.register(mockUserData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/auth/register', mockUserData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should handle registration errors gracefully', async () => {
      const mockUserData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
        confirmPassword: 'password123',
        acceptTerms: true,
      };

      const mockError = {
        response: {
          data: {
            error: {
              code: 'CONFLICT',
              message: 'An account with this email already exists',
            },
          },
        },
      };

      mockApiClient.post.mockRejectedValue(mockError);

      await expect(AuthService.register(mockUserData)).rejects.toThrow('An account with this email already exists');
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      mockApiClient.post.mockResolvedValue({});

      await AuthService.logout();

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/auth/logout');
    });

    it('should handle logout errors gracefully', async () => {
      const mockError = new Error('Network error');
      mockApiClient.post.mockRejectedValue(mockError);

      // Should not throw error even if logout fails
      await expect(AuthService.logout()).resolves.toBeUndefined();
    });
  });
});
