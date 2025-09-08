// store/slices/booksSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '../../types/learning';
import { BookFilters, PaginationInfo } from '../../types/store';
import { BooksState } from '../../types/store';

const initialState: BooksState = {
  books: [],
  currentBook: null,
  enrolledBooks: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  },
  filters: {},
  searchQuery: '',
  sortBy: 'title',
  sortDirection: 'asc',
};

// Mock async thunks for now - will be replaced with actual API calls
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params: { page?: number; pageSize?: number; filters?: BookFilters } = {}, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      const mockBooks: Book[] = [
        {
          id: '1',
          title: 'Essential English Vocabulary',
          description: 'Core vocabulary for everyday English communication',
          language: 'en' as any,
          totalWords: 500,
          difficulty: 'Beginner' as any,
          createdAt: '2024-01-01T00:00:00Z',
          isPublic: true,
          author: 'LexiK3 Team',
          categories: ['general', 'beginner'],
          estimatedTime: '2 weeks',
          tags: ['english', 'beginner'],
          userProgress: {
            isEnrolled: true,
            wordsLearned: 150,
            currentStreak: 7,
            longestStreak: 15,
            lastStudied: '2024-01-15T10:30:00Z',
            progressPercentage: 30,
            averageAccuracy: 0.85,
            totalStudyTime: 120,
            isCompleted: false,
          },
        },
      ];

      const pagination: PaginationInfo = {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        totalItems: mockBooks.length,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      };

      return { books: mockBooks, pagination };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId: string, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      const mockBook: Book = {
        id: bookId,
        title: 'Essential English Vocabulary',
        description: 'Core vocabulary for everyday English communication',
        language: 'en' as any,
        totalWords: 500,
        difficulty: 'Beginner' as any,
        createdAt: '2024-01-01T00:00:00Z',
        isPublic: true,
        author: 'LexiK3 Team',
        categories: ['general', 'beginner'],
        estimatedTime: '2 weeks',
        tags: ['english', 'beginner'],
      };
      return mockBook;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch book');
    }
  }
);

export const enrollInBook = createAsyncThunk(
  'books/enrollInBook',
  async (bookId: string, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      return bookId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to enroll in book');
    }
  }
);

export const unenrollFromBook = createAsyncThunk(
  'books/unenrollFromBook',
  async (bookId: string, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      return bookId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to unenroll from book');
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setCurrentBook: (state, action: PayloadAction<Book | null>) => {
      state.currentBook = action.payload;
    },
    setFilters: (state, action: PayloadAction<BookFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortDirection: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Books
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload.books;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Book by ID
    builder
      .addCase(fetchBookById.fulfilled, (state, action: PayloadAction<Book>) => {
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Enroll in Book
    builder
      .addCase(enrollInBook.fulfilled, (state, action: PayloadAction<string>) => {
        const bookId = action.payload;
        const book = state.books.find(b => b.id === bookId);
        if (book && book.userProgress) {
          book.userProgress.isEnrolled = true;
        }
        if (state.currentBook?.id === bookId && state.currentBook.userProgress) {
          state.currentBook.userProgress.isEnrolled = true;
        }
      })
      .addCase(enrollInBook.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Unenroll from Book
    builder
      .addCase(unenrollFromBook.fulfilled, (state, action: PayloadAction<string>) => {
        const bookId = action.payload;
        const book = state.books.find(b => b.id === bookId);
        if (book && book.userProgress) {
          book.userProgress.isEnrolled = false;
        }
        if (state.currentBook?.id === bookId && state.currentBook.userProgress) {
          state.currentBook.userProgress.isEnrolled = false;
        }
      })
      .addCase(unenrollFromBook.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { 
  setCurrentBook, 
  setFilters, 
  clearFilters, 
  setSearchQuery, 
  setSorting, 
  clearError 
} = booksSlice.actions;

export default booksSlice.reducer;
