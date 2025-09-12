// hooks/useBooks.ts
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooks, enrollInBook, unenrollFromBook, clearError } from '../store/slices/booksSlice';

/**
 * Custom hook for books operations
 * Provides a clean interface for book-related actions and state
 */
export const useBooks = () => {
  const dispatch = useAppDispatch();
  const { 
    books, 
    enrolledBooks, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.books);

  const loadBooks = async (params?: any) => {
    const result = await dispatch(fetchBooks(params || {}));
    return result;
  };

  const enroll = async (bookId: string) => {
    const result = await dispatch(enrollInBook(bookId));
    return result;
  };

  const unenroll = async (bookId: string) => {
    const result = await dispatch(unenrollFromBook(bookId));
    return result;
  };

  const clearBooksError = () => {
    dispatch(clearError());
  };

  const isBookEnrolled = (bookId: string): boolean => {
    return enrolledBooks.some(enrolledBook => enrolledBook.id === bookId) ||
           books.find(book => book.id === bookId)?.userProgress?.isEnrolled || false;
  };

  return {
    books,
    enrolledBooks,
    isLoading,
    error,
    loadBooks,
    enroll,
    unenroll,
    clearBooksError,
    isBookEnrolled,
  };
};
