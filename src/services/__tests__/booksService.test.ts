// services/__tests__/booksService.test.ts
import { BooksService } from '../books/booksService';
import { getApiClient } from '../api/apiServiceFactory';

// Mock the API client
jest.mock('../api/apiServiceFactory', () => ({
  getApiClient: jest.fn(),
}));

describe('BooksService', () => {
  const mockApiClient = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getApiClient as jest.Mock).mockReturnValue(mockApiClient);
  });

  describe('getBooks', () => {
    it('should successfully fetch all books', async () => {
      const mockBooks = [
        {
          id: '1',
          title: 'Essential English Vocabulary',
          description: 'Core vocabulary for everyday English communication',
          language: 'en',
          totalWords: 500,
          difficulty: 'Beginner',
          isPublic: true,
          author: 'LexiK3 Team',
          categories: ['general', 'beginner'],
          estimatedTime: '2 weeks',
          tags: ['english', 'beginner'],
        },
      ];

      const mockResponse = {
        data: {
          data: mockBooks,
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await BooksService.getBooks();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/books');
      expect(result).toEqual(mockBooks);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = {
        response: {
          data: {
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many requests',
            },
          },
        },
      };

      mockApiClient.get.mockRejectedValue(mockError);

      await expect(BooksService.getBooks()).rejects.toThrow('Too many requests');
    });
  });

  describe('getBookById', () => {
    it('should successfully fetch a book by ID', async () => {
      const bookId = '1';
      const mockBook = {
        id: bookId,
        title: 'Essential English Vocabulary',
        description: 'Core vocabulary for everyday English communication',
        language: 'en',
        totalWords: 500,
        difficulty: 'Beginner',
        isPublic: true,
        author: 'LexiK3 Team',
        categories: ['general', 'beginner'],
        estimatedTime: '2 weeks',
        tags: ['english', 'beginner'],
      };

      const mockResponse = {
        data: {
          data: mockBook,
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await BooksService.getBookById(bookId);

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/books/1');
      expect(result).toEqual(mockBook);
    });

    it('should handle book not found error', async () => {
      const bookId = '999';
      const mockError = {
        response: {
          data: {
            error: {
              code: 'BOOK_NOT_FOUND',
              message: 'Book not found',
            },
          },
        },
      };

      mockApiClient.get.mockRejectedValue(mockError);

      await expect(BooksService.getBookById(bookId)).rejects.toThrow('Book not found');
    });
  });

  describe('enrollInBook', () => {
    it('should successfully enroll in a book', async () => {
      const bookId = '1';
      const mockEnrollment = {
        id: 'enrollment-1',
        userId: 'user-1',
        bookId: bookId,
        enrolledAt: '2024-01-01T00:00:00Z',
        progress: {
          isEnrolled: true,
          wordsLearned: 0,
          currentStreak: 0,
          longestStreak: 0,
          progressPercentage: 0,
          averageAccuracy: 0,
          totalStudyTime: 0,
          isCompleted: false,
        },
        book: {
          id: bookId,
          title: 'Essential English Vocabulary',
          description: 'Core vocabulary for everyday English communication',
          language: 'en',
          totalWords: 500,
          difficulty: 'Beginner',
          isPublic: true,
          author: 'LexiK3 Team',
          categories: ['general', 'beginner'],
          estimatedTime: '2 weeks',
          tags: ['english', 'beginner'],
        },
      };

      const mockResponse = {
        data: {
          data: mockEnrollment,
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await BooksService.enrollInBook(bookId);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/books/1/enroll');
      expect(result).toEqual(mockEnrollment);
    });

    it('should handle enrollment limit error', async () => {
      const bookId = '1';
      const mockError = {
        response: {
          data: {
            error: {
              code: 'ENROLLMENT_LIMIT_REACHED',
              message: 'You have reached the maximum number of book enrollments',
            },
          },
        },
      };

      mockApiClient.post.mockRejectedValue(mockError);

      await expect(BooksService.enrollInBook(bookId)).rejects.toThrow('You have reached the maximum number of book enrollments');
    });
  });

  describe('unenrollFromBook', () => {
    it('should successfully unenroll from a book', async () => {
      const bookId = '1';

      mockApiClient.delete.mockResolvedValue({});

      await BooksService.unenrollFromBook(bookId);

      expect(mockApiClient.delete).toHaveBeenCalledWith('/api/books/1/enroll');
    });

    it('should handle unenrollment errors gracefully', async () => {
      const bookId = '1';
      const mockError = {
        response: {
          data: {
            error: {
              code: 'NOT_ENROLLED',
              message: 'You are not enrolled in this book',
            },
          },
        },
      };

      mockApiClient.delete.mockRejectedValue(mockError);

      await expect(BooksService.unenrollFromBook(bookId)).rejects.toThrow('You are not enrolled in this book');
    });
  });
});
