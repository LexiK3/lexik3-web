// services/error/__tests__/ErrorHandler.test.ts
import { ErrorHandler } from '../ErrorHandler';
import { AxiosError } from 'axios';

describe('ErrorHandler', () => {
  describe('handleApiError', () => {
    it('should handle Axios errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            success: false,
            error: {
              message: 'API Error',
              code: 'API_ERROR'
            },
            timestamp: '2023-01-01T00:00:00Z'
          }
        }
      } as AxiosError;

      const result = ErrorHandler.handleApiError(axiosError);
      expect(result).toBe('API Error');
    });

    it('should handle Axios errors without API error structure', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {
            message: 'Simple error message'
          }
        }
      } as AxiosError;

      const result = ErrorHandler.handleApiError(axiosError);
      expect(result).toBe('Server error: 500');
    });

    it('should handle Axios errors with status codes', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {}
        }
      } as AxiosError;

      const result = ErrorHandler.handleApiError(axiosError);
      expect(result).toBe('Server error: 404');
    });

    it('should handle regular Error objects', () => {
      const error = new Error('Regular error');
      const result = ErrorHandler.handleApiError(error);
      expect(result).toBe('Regular error');
    });

    it('should handle unknown errors', () => {
      const result = ErrorHandler.handleApiError('Unknown error');
      expect(result).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('handleAuthError', () => {
    it('should handle authentication errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            success: false,
            error: {
              message: 'Invalid credentials',
              code: 'INVALID_CREDENTIALS'
            },
            timestamp: '2023-01-01T00:00:00Z'
          }
        }
      } as AxiosError;

      const result = ErrorHandler.handleAuthError(axiosError);
      expect(result).toBe('Invalid credentials');
    });

    it('should handle 401 errors with default message', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {}
        }
      } as AxiosError;

      const result = ErrorHandler.handleAuthError(axiosError);
      expect(result).toBe('Server error: 401');
    });

    it('should handle 403 errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
          data: {}
        }
      } as AxiosError;

      const result = ErrorHandler.handleAuthError(axiosError);
      expect(result).toBe('Server error: 403');
    });

    it('should fall back to handleApiError for non-auth errors', () => {
      const error = new Error('Network error');
      const result = ErrorHandler.handleAuthError(error);
      expect(result).toBe('Network error');
    });
  });

  describe('handleBooksError', () => {
    it('should handle books-specific errors', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {
            success: false,
            error: {
              message: 'Book not found',
              code: 'BOOK_NOT_FOUND'
            },
            timestamp: '2023-01-01T00:00:00Z'
          }
        }
      } as AxiosError;

      const result = ErrorHandler.handleBooksError(axiosError);
      expect(result).toBe('Book not found.');
    });

    it('should handle 404 errors with default message', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: {}
        }
      } as AxiosError;

      const result = ErrorHandler.handleBooksError(axiosError);
      expect(result).toBe('Server error: 404');
    });

    it('should fall back to handleApiError for non-books errors', () => {
      const error = new Error('Network error');
      const result = ErrorHandler.handleBooksError(error);
      expect(result).toBe('Network error');
    });
  });

  describe('logError', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log errors with context', () => {
      const error = new Error('Test error');
      ErrorHandler.logError(error, 'TestContext');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[TestContext] Error:',
        'Test error',
        error
      );
    });

    it('should log unknown errors', () => {
      ErrorHandler.logError('Unknown error', 'TestContext');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[TestContext] Error:',
        'An unexpected error occurred. Please try again.',
        'Unknown error'
      );
    });
  });
});
