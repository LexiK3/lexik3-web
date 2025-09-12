// hooks/__tests__/useBooks.test.ts
import { renderHook } from '@testing-library/react';
import { useBooks } from '../useBooks';

// Mock the store hooks
jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector: any) => selector({
    books: {
      books: [],
      enrolledBooks: [],
      isLoading: false,
      error: null,
    },
  }),
}));

describe('useBooks', () => {
  it('should return books state and methods', () => {
    const { result } = renderHook(() => useBooks());

    expect(result.current).toHaveProperty('books');
    expect(result.current).toHaveProperty('enrolledBooks');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('loadBooks');
    expect(result.current).toHaveProperty('enroll');
    expect(result.current).toHaveProperty('unenroll');
    expect(result.current).toHaveProperty('clearBooksError');
    expect(result.current).toHaveProperty('isBookEnrolled');
  });

  it('should have correct initial values', () => {
    const { result } = renderHook(() => useBooks());

    expect(result.current.books).toEqual([]);
    expect(result.current.enrolledBooks).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should provide function methods', () => {
    const { result } = renderHook(() => useBooks());

    expect(typeof result.current.loadBooks).toBe('function');
    expect(typeof result.current.enroll).toBe('function');
    expect(typeof result.current.unenroll).toBe('function');
    expect(typeof result.current.clearBooksError).toBe('function');
    expect(typeof result.current.isBookEnrolled).toBe('function');
  });

  it('should check book enrollment correctly', () => {
    const { result } = renderHook(() => useBooks());

    // Test with empty arrays
    expect(result.current.isBookEnrolled('book1')).toBe(false);
  });
});
