// services/interfaces/IBooksService.ts
import { Book, BookEnrollment, BookWord, DailyWords } from '../../types/learning';
import { BooksResponse } from '../../types/common';

/**
 * Books service interface following Clean Architecture principles
 * Defines the contract for book-related operations
 */
export interface IBooksService {
  /**
   * Get all available books with pagination
   * @returns Promise<BooksResponse> - Books with pagination info
   */
  getBooks(): Promise<BooksResponse>;

  /**
   * Get book details by ID
   * @param bookId - Book identifier
   * @returns Promise<Book> - Book details
   */
  getBookById(bookId: string): Promise<Book>;

  /**
   * Enroll current user in a book
   * @param bookId - Book identifier
   * @returns Promise<BookEnrollment> - Enrollment details
   */
  enrollInBook(bookId: string): Promise<BookEnrollment>;

  /**
   * Remove current user from a book
   * @param bookId - Book identifier
   * @returns Promise<void>
   */
  unenrollFromBook(bookId: string): Promise<void>;

  /**
   * Get all words for a specific book
   * @param bookId - Book identifier
   * @returns Promise<BookWord[]> - Array of book words
   */
  getBookWords(bookId: string): Promise<BookWord[]>;

  /**
   * Get daily words for a specific day
   * @param bookId - Book identifier
   * @param day - Day number
   * @returns Promise<DailyWords> - Daily words data
   */
  getDailyWords(bookId: string, day: number): Promise<DailyWords>;

  /**
   * Get user's enrolled books
   * @returns Promise<BookEnrollment[]> - Array of user's book enrollments
   */
  getEnrolledBooks(): Promise<BookEnrollment[]>;
}
