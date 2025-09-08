// store/slices/booksSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book, BookEnrollment } from '../../types/learning';
import { BookFilters, PaginationInfo } from '../../types/store';
import { BooksState } from '../../types/store';
import { BooksService } from '../../services/books/booksService';

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

// Async thunks using real API service
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params: { page?: number; pageSize?: number; filters?: BookFilters } = {}, { rejectWithValue }) => {
    try {
      const books = await BooksService.getBooks();
      
      // Apply client-side filtering and pagination for now
      // TODO: Move filtering and pagination to backend
      let filteredBooks = books;
      
      if (params.filters?.difficulty) {
        filteredBooks = filteredBooks.filter(book => book.difficulty === params.filters?.difficulty);
      }
      
      if (params.filters?.categories && params.filters.categories.length > 0) {
        filteredBooks = filteredBooks.filter(book => 
          book.categories.some(category => params.filters?.categories?.includes(category))
        );
      }
      
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
      
      const pagination: PaginationInfo = {
        page,
        pageSize,
        totalItems: filteredBooks.length,
        totalPages: Math.ceil(filteredBooks.length / pageSize),
        hasNext: endIndex < filteredBooks.length,
        hasPrevious: page > 1,
      };

      return { books: paginatedBooks, pagination };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch books');
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const book = await BooksService.getBookById(bookId);
      return book;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch book');
    }
  }
);

export const enrollInBook = createAsyncThunk(
  'books/enrollInBook',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const enrollment = await BooksService.enrollInBook(bookId);
      return enrollment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to enroll in book');
    }
  }
);

export const unenrollFromBook = createAsyncThunk(
  'books/unenrollFromBook',
  async (bookId: string, { rejectWithValue }) => {
    try {
      await BooksService.unenrollFromBook(bookId);
      return bookId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to unenroll from book');
    }
  }
);

export const fetchEnrolledBooks = createAsyncThunk(
  'books/fetchEnrolledBooks',
  async (_, { rejectWithValue }) => {
    try {
      const enrolledBooks = await BooksService.getEnrolledBooks();
      return enrolledBooks;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch enrolled books');
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
      .addCase(enrollInBook.fulfilled, (state, action: PayloadAction<BookEnrollment>) => {
        const enrollment = action.payload;
        const bookId = enrollment.bookId;
        const book = state.books.find(b => b.id === bookId);
        if (book && book.userProgress) {
          book.userProgress.isEnrolled = true;
        }
        if (state.currentBook?.id === bookId && state.currentBook.userProgress) {
          state.currentBook.userProgress.isEnrolled = true;
        }
        // Add to enrolled books
        state.enrolledBooks.push(enrollment.book);
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

    // Fetch Enrolled Books
    builder
      .addCase(fetchEnrolledBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledBooks.fulfilled, (state, action: PayloadAction<BookEnrollment[]>) => {
        state.isLoading = false;
        state.enrolledBooks = action.payload;
      })
      .addCase(fetchEnrolledBooks.rejected, (state, action) => {
        state.isLoading = false;
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
