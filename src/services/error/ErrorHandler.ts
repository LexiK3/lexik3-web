// services/error/ErrorHandler.ts
import { AxiosError } from 'axios';
import { ApiError } from '../../types/common';

/**
 * Centralized error handling service following Clean Architecture principles
 * Provides consistent error processing and user-friendly messages
 */
export class ErrorHandler {
  /**
   * Handle API errors and return user-friendly messages
   * @param error - The error to handle
   * @returns string - User-friendly error message
   */
  static handleApiError(error: unknown): string {
    if (this.isAxiosError(error)) {
      return this.handleAxiosError(error);
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Handle authentication-specific errors
   * @param error - The error to handle
   * @returns string - User-friendly authentication error message
   */
  static handleAuthError(error: unknown): string {
    if (this.isAxiosError(error)) {
      const apiError = this.extractApiError(error);
      if (apiError) {
        return this.getAuthErrorMessage(apiError);
      }
    }

    return this.handleApiError(error);
  }

  /**
   * Handle books-specific errors
   * @param error - The error to handle
   * @returns string - User-friendly books error message
   */
  static handleBooksError(error: unknown): string {
    if (this.isAxiosError(error)) {
      const apiError = this.extractApiError(error);
      if (apiError) {
        return this.getBooksErrorMessage(apiError);
      }
    }

    return this.handleApiError(error);
  }

  /**
   * Check if error is an Axios error
   * @param error - The error to check
   * @returns boolean - True if Axios error
   */
  private static isAxiosError(error: unknown): error is AxiosError {
    return error !== null && 
           typeof error === 'object' && 
           ('isAxiosError' in error || 
            ('response' in error && typeof (error as any).response === 'object'));
  }

  /**
   * Handle Axios-specific errors
   * @param error - Axios error
   * @returns string - User-friendly error message
   */
  private static handleAxiosError(error: AxiosError): string {
    if (error.response) {
      // Server responded with error status
      const apiError = this.extractApiError(error);
      if (apiError) {
        return apiError.message;
      }
      return `Server error: ${error.response.status}`;
    }

    if (error.request) {
      // Request was made but no response received
      return 'Network error. Please check your connection and try again.';
    }

    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }

  /**
   * Extract API error from Axios error response
   * @param error - Axios error
   * @returns ApiError | null - Extracted API error or null
   */
  private static extractApiError(error: AxiosError): ApiError | null {
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as any;
      if (data.error && typeof data.error === 'object') {
        return data as ApiError;
      }
    }
    
    // Handle test mock structure
    if (error.response?.data?.error && typeof error.response.data.error === 'object') {
      return error.response.data as ApiError;
    }
    
    return null;
  }

  /**
   * Get authentication-specific error message
   * @param apiError - API error object
   * @returns string - User-friendly error message
   */
  private static getAuthErrorMessage(apiError: ApiError): string {
    const { code, message } = apiError.error;

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

  /**
   * Get books-specific error message
   * @param apiError - API error object
   * @returns string - User-friendly error message
   */
  private static getBooksErrorMessage(apiError: ApiError): string {
    const { code, message } = apiError.error;

    switch (code) {
      case 'BOOK_NOT_FOUND':
        return 'Book not found.';
      case 'ALREADY_ENROLLED':
        return 'You are already enrolled in this book.';
      case 'NOT_ENROLLED':
        return 'You are not enrolled in this book.';
      case 'ENROLLMENT_LIMIT_REACHED':
        return 'You have reached the maximum number of book enrollments.';
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again.';
      case 'RATE_LIMITED':
        return 'Too many requests. Please wait a moment.';
      default:
        return message || 'An error occurred while accessing books.';
    }
  }

  /**
   * Log error for debugging purposes
   * @param error - The error to log
   * @param context - Additional context information
   */
  static logError(error: unknown, context?: string): void {
    const errorMessage = this.handleApiError(error);
    const logContext = context ? `[${context}]` : '';
    
    console.error(`${logContext} Error:`, errorMessage, error);
    
    // In production, you might want to send this to an error tracking service
    // like Sentry, LogRocket, etc.
  }
}
