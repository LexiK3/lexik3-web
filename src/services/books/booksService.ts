// services/books/booksService.ts
import { getApiClient } from '../api/apiServiceFactory';
import { API_ENDPOINTS } from '../api/endpoints';
import { Book, BookEnrollment, BookWord, DailyWords } from '../../types/learning';
import { ApiResponse, BooksApiResponse } from '../../types/common';
import { AxiosResponse } from 'axios';

export class BooksService {
  // Get all available books
  static async getBooks(): Promise<{ books: Book[]; pagination: any }> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(API_ENDPOINTS.BOOKS.LIST) as AxiosResponse<BooksApiResponse<Book>>;
      
      // Ensure we have valid data - API returns data.items, not data.data
      if (!response.data || !response.data.data || !response.data.data.items) {
        console.warn('Invalid response from books API:', response.data);
        return { books: [], pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 0, hasNext: false, hasPrevious: false } };
      }
      
      // Ensure data.items is an array
      const books = Array.isArray(response.data.data.items) ? response.data.data.items : [];
      console.log('Fetched books:', books.length, 'items');
      
      // Return both books and pagination data from API
      return {
        books,
        pagination: {
          page: response.data.data.page,
          pageSize: response.data.data.pageSize,
          totalItems: response.data.data.totalItems,
          totalPages: response.data.data.totalPages,
          hasNext: response.data.data.hasNext,
          hasPrevious: response.data.data.hasPrevious
        }
      };
    } catch (error: any) {
      console.error('Error fetching books:', error);
      throw new Error(this.handleBooksError(error));
    }
  }

  // Get book details by ID
  static async getBookById(bookId: string): Promise<Book> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(API_ENDPOINTS.BOOKS.DETAIL(bookId)) as AxiosResponse<ApiResponse<Book>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleBooksError(error));
    }
  }

  // Enroll in a book
  static async enrollInBook(bookId: string): Promise<BookEnrollment> {
    try {
      const client = getApiClient();
      const response = await (client as any).post(API_ENDPOINTS.BOOKS.ENROLL(bookId)) as AxiosResponse<ApiResponse<BookEnrollment>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleBooksError(error));
    }
  }

  // Unenroll from a book
  static async unenrollFromBook(bookId: string): Promise<void> {
    try {
      const client = getApiClient();
      await (client as any).delete(API_ENDPOINTS.BOOKS.UNENROLL(bookId));
    } catch (error: any) {
      throw new Error(this.handleBooksError(error));
    }
  }

  // Get all words for a book
  static async getBookWords(bookId: string): Promise<BookWord[]> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(API_ENDPOINTS.BOOKS.WORDS(bookId)) as AxiosResponse<ApiResponse<BookWord[]>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleBooksError(error));
    }
  }

  // Get daily words for a specific day
  static async getDailyWords(bookId: string, day: number): Promise<DailyWords> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(API_ENDPOINTS.BOOKS.DAILY_WORDS(bookId, day)) as AxiosResponse<ApiResponse<DailyWords>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleBooksError(error));
    }
  }

  // Get user's enrolled books
  static async getEnrolledBooks(): Promise<BookEnrollment[]> {
    try {
      const client = getApiClient();
      const response = await (client as any).get(`${API_ENDPOINTS.BOOKS.LIST}/enrolled`) as AxiosResponse<ApiResponse<BookEnrollment[]>>;
      return response.data.data;
    } catch (error: any) {
      throw new Error(this.handleBooksError(error));
    }
  }

  // Handle books service errors
  private static handleBooksError(error: any): string {
    if (error.response?.data?.error) {
      const { code, message } = error.response.data.error;
      
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
    
    return 'Network error. Please check your connection.';
  }
}
