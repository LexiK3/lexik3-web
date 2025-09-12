// store/selectors/booksSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../types/store';

// Basic selectors
export const selectBooks = (state: RootState) => state.books;
export const selectBooksList = (state: RootState) => state.books.books;
export const selectCurrentBook = (state: RootState) => state.books.currentBook;
export const selectEnrolledBooks = (state: RootState) => state.books.enrolledBooks;
export const selectBooksLoading = (state: RootState) => state.books.isLoading;
export const selectBooksError = (state: RootState) => state.books.error;
export const selectBooksPagination = (state: RootState) => state.books.pagination;
export const selectBooksFilters = (state: RootState) => state.books.filters;
export const selectBooksSearchQuery = (state: RootState) => state.books.searchQuery;
export const selectBooksSortBy = (state: RootState) => state.books.sortBy;
export const selectBooksSortDirection = (state: RootState) => state.books.sortDirection;

// Memoized selectors
export const selectFilteredBooks = createSelector(
  [selectBooksList, selectBooksFilters, selectBooksSearchQuery],
  (books, filters, searchQuery) => {
    let filtered = [...books];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(book => book.difficulty === filters.difficulty);
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(book =>
        book.categories.some(category => filters.categories?.includes(category))
      );
    }

    // Apply language filter
    if (filters.language) {
      filtered = filtered.filter(book => book.language === filters.language);
    }

    // Apply public filter
    if (filters.isPublic !== undefined) {
      filtered = filtered.filter(book => book.isPublic === filters.isPublic);
    }

    return filtered;
  }
);

export const selectSortedBooks = createSelector(
  [selectFilteredBooks, selectBooksSortBy, selectBooksSortDirection],
  (books, sortBy, sortDirection) => {
    const sorted = [...books].sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }
);

export const selectBooksByDifficulty = createSelector(
  [selectBooksList],
  (books) => {
    const grouped = books.reduce((acc, book) => {
      const difficulty = book.difficulty || 'Unknown';
      if (!acc[difficulty]) {
        acc[difficulty] = [];
      }
      acc[difficulty].push(book);
      return acc;
    }, {} as Record<string, typeof books>);

    return grouped;
  }
);

export const selectBooksByCategory = createSelector(
  [selectBooksList],
  (books) => {
    const grouped = books.reduce((acc, book) => {
      book.categories.forEach(category => {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(book);
      });
      return acc;
    }, {} as Record<string, typeof books>);

    return grouped;
  }
);

export const selectEnrolledBookIds = createSelector(
  [selectEnrolledBooks],
  (enrolledBooks) => enrolledBooks.map(book => book.id)
);

export const selectIsBookEnrolled = createSelector(
  [selectEnrolledBookIds],
  (enrolledIds) => (bookId: string) => enrolledIds.includes(bookId)
);

export const selectBooksStats = createSelector(
  [selectBooksList, selectEnrolledBooks],
  (books, enrolledBooks) => ({
    totalBooks: books.length,
    enrolledBooks: enrolledBooks.length,
    availableBooks: books.length - enrolledBooks.length,
    difficultyDistribution: books.reduce((acc, book) => {
      const difficulty = book.difficulty || 'Unknown';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    categoryDistribution: books.reduce((acc, book) => {
      book.categories.forEach(category => {
        acc[category] = (acc[category] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>)
  })
);

export const selectBooksStatus = createSelector(
  [selectBooksLoading, selectBooksError, selectBooksList],
  (isLoading, error, books) => ({
    isLoading,
    error,
    hasError: !!error,
    isEmpty: books.length === 0,
    isReady: !isLoading && !error
  })
);
