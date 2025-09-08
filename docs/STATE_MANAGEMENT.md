# LexiK3 Frontend State Management Guidelines

## 📋 Table of Contents

- [State Management Overview](#state-management-overview)
- [Redux Toolkit Implementation](#redux-toolkit-implementation)
- [State Structure](#state-structure)
- [Slice Implementations](#slice-implementations)
- [Middleware Configuration](#middleware-configuration)
- [Async Actions](#async-actions)
- [State Persistence](#state-persistence)
- [Performance Optimization](#performance-optimization)
- [Testing State Management](#testing-state-management)

## 🗃️ State Management Overview

LexiK3 uses Redux Toolkit for predictable state management with TypeScript support. The state is organized into feature-based slices with clear separation of concerns.

### Key Principles
- **Single Source of Truth**: All application state in one store
- **Immutable Updates**: State changes through pure functions
- **Predictable State**: State changes follow strict patterns
- **Time Travel Debugging**: Redux DevTools support
- **Type Safety**: Full TypeScript integration

### State Architecture

```
store/
├── index.ts                 # Store configuration
├── middleware/              # Custom middleware
│   ├── authMiddleware.ts    # Authentication middleware
│   ├── apiMiddleware.ts     # API request middleware
│   └── persistenceMiddleware.ts # State persistence
├── slices/                  # Feature slices
│   ├── authSlice.ts         # Authentication state
│   ├── booksSlice.ts        # Books management
│   ├── learningSlice.ts     # Learning sessions
│   ├── progressSlice.ts     # Progress tracking
│   └── uiSlice.ts           # UI state
└── types/                   # State type definitions
    └── store.ts             # Store types
```

## 🛠️ Redux Toolkit Implementation

### Store Configuration

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';
import learningReducer from './slices/learningSlice';
import progressReducer from './slices/progressSlice';
import uiReducer from './slices/uiSlice';

// Import middleware
import { authMiddleware } from './middleware/authMiddleware';
import { apiMiddleware } from './middleware/apiMiddleware';
import { persistenceMiddleware } from './middleware/persistenceMiddleware';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and UI state
  blacklist: ['learning'], // Don't persist learning sessions
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  books: booksReducer,
  learning: learningReducer,
  progress: progressReducer,
  ui: uiReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    .concat(authMiddleware)
    .concat(apiMiddleware)
    .concat(persistenceMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export { useAppDispatch, useAppSelector } from './hooks';
```

### Typed Hooks

```typescript
// store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 📊 State Structure

### Root State Interface

```typescript
// store/types/store.ts
export interface RootState {
  auth: AuthState;
  books: BooksState;
  learning: LearningState;
  progress: ProgressState;
  ui: UIState;
}

// Auth State
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: string | null;
}

// Books State
export interface BooksState {
  books: Book[];
  currentBook: Book | null;
  enrolledBooks: Book[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: BookFilters;
}

// Learning State
export interface LearningState {
  currentSession: LearningSession | null;
  sessionHistory: LearningSession[];
  currentWordIndex: number;
  answers: SessionAnswer[];
  results: SessionResult[];
  isLoading: boolean;
  error: string | null;
  sessionStats: SessionStats;
}

// Progress State
export interface ProgressState {
  userProgress: UserProgress | null;
  dailyProgress: DailyActivity[];
  statistics: LearningStatistics | null;
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// UI State
export interface UIState {
  theme: 'light' | 'dark';
  language: string;
  sidebarOpen: boolean;
  notifications: Notification[];
  modals: ModalState;
  loading: {
    global: boolean;
    auth: boolean;
    books: boolean;
    learning: boolean;
    progress: boolean;
  };
}
```

## 🍰 Slice Implementations

### Authentication Slice

```typescript
// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '../../services/auth/authService';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastActivity: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const user = await AuthService.register(userData);
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.refreshToken();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Token refresh failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastActivity = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.lastActivity = new Date().toISOString();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        // Registration successful, user needs to login
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.lastActivity = new Date().toISOString();
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = 'Session expired';
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.lastActivity = null;
      });
  },
});

export const { clearError, updateLastActivity, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
```

### Learning Session Slice

```typescript
// store/slices/learningSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LearningService } from '../../services/learning/learningService';
import { LearningSession, SessionAnswer, SessionResult, StartSessionRequest } from '../../types/learning';

interface LearningState {
  currentSession: LearningSession | null;
  sessionHistory: LearningSession[];
  currentWordIndex: number;
  answers: SessionAnswer[];
  results: SessionResult[];
  isLoading: boolean;
  error: string | null;
  sessionStats: SessionStats;
}

interface SessionStats {
  totalSessions: number;
  totalWordsStudied: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
}

const initialState: LearningState = {
  currentSession: null,
  sessionHistory: [],
  currentWordIndex: 0,
  answers: [],
  results: [],
  isLoading: false,
  error: null,
  sessionStats: {
    totalSessions: 0,
    totalWordsStudied: 0,
    averageAccuracy: 0,
    currentStreak: 0,
    longestStreak: 0,
  },
};

// Async thunks
export const startSession = createAsyncThunk(
  'learning/startSession',
  async (sessionData: StartSessionRequest, { rejectWithValue }) => {
    try {
      const session = await LearningService.startSession(sessionData);
      return session;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to start session');
    }
  }
);

export const submitAnswer = createAsyncThunk(
  'learning/submitAnswer',
  async ({ sessionId, answer }: { sessionId: string; answer: SessionAnswer }, { rejectWithValue }) => {
    try {
      const result = await LearningService.submitAnswer(sessionId, answer);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to submit answer');
    }
  }
);

export const completeSession = createAsyncThunk(
  'learning/completeSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const completion = await LearningService.completeSession(sessionId);
      return completion;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to complete session');
    }
  }
);

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    nextWord: (state) => {
      state.currentWordIndex += 1;
    },
    previousWord: (state) => {
      state.currentWordIndex = Math.max(0, state.currentWordIndex - 1);
    },
    addAnswer: (state, action: PayloadAction<SessionAnswer>) => {
      state.answers.push(action.payload);
    },
    clearSession: (state) => {
      state.currentSession = null;
      state.currentWordIndex = 0;
      state.answers = [];
      state.results = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    updateSessionStats: (state, action: PayloadAction<SessionStats>) => {
      state.sessionStats = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Start Session
    builder
      .addCase(startSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startSession.fulfilled, (state, action: PayloadAction<LearningSession>) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.currentWordIndex = 0;
        state.answers = [];
        state.results = [];
      })
      .addCase(startSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Submit Answer
    builder
      .addCase(submitAnswer.fulfilled, (state, action: PayloadAction<SessionResult>) => {
        state.results.push(action.payload);
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Complete Session
    builder
      .addCase(completeSession.fulfilled, (state, action) => {
        if (state.currentSession) {
          state.sessionHistory.push({
            ...state.currentSession,
            completedAt: action.payload.completedAt,
          });
        }
        state.currentSession = null;
        state.currentWordIndex = 0;
        state.answers = [];
        state.results = [];
      })
      .addCase(completeSession.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  nextWord,
  previousWord,
  addAnswer,
  clearSession,
  clearError,
  updateSessionStats,
} = learningSlice.actions;

export default learningSlice.reducer;
```

### Books Management Slice

```typescript
// store/slices/booksSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BooksService } from '../../services/books/booksService';
import { Book, BookFilters, PaginationInfo } from '../../types/books';

interface BooksState {
  books: Book[];
  currentBook: Book | null;
  enrolledBooks: Book[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: BookFilters;
}

interface BookFilters {
  language?: string;
  difficulty?: string;
  search?: string;
  category?: string;
}

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
};

// Async thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params?: { page?: number; pageSize?: number; filters?: BookFilters }, { rejectWithValue }) => {
    try {
      const response = await BooksService.getBooks(params);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch books');
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const book = await BooksService.getBookById(bookId);
      return book;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch book');
    }
  }
);

export const enrollInBook = createAsyncThunk(
  'books/enrollInBook',
  async (bookId: string, { rejectWithValue }) => {
    try {
      await BooksService.enrollInBook(bookId);
      return bookId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to enroll in book');
    }
  }
);

export const unenrollFromBook = createAsyncThunk(
  'books/unenrollFromBook',
  async (bookId: string, { rejectWithValue }) => {
    try {
      await BooksService.unenrollFromBook(bookId);
      return bookId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to unenroll from book');
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
        if (book) {
          book.userProgress = { ...book.userProgress, isEnrolled: true };
        }
        if (state.currentBook?.id === bookId) {
          state.currentBook.userProgress = { ...state.currentBook.userProgress, isEnrolled: true };
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
        if (book) {
          book.userProgress = { ...book.userProgress, isEnrolled: false };
        }
        if (state.currentBook?.id === bookId) {
          state.currentBook.userProgress = { ...state.currentBook.userProgress, isEnrolled: false };
        }
      })
      .addCase(unenrollFromBook.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentBook, setFilters, clearFilters, clearError } = booksSlice.actions;
export default booksSlice.reducer;
```

## ⚙️ Middleware Configuration

### Authentication Middleware

```typescript
// store/middleware/authMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { AuthService } from '../../services/auth/authService';

export const authMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  // Check if user is authenticated before certain actions
  if (action.type.startsWith('learning/') || action.type.startsWith('progress/')) {
    const state = store.getState();
    if (!state.auth.isAuthenticated) {
      console.warn('Action requires authentication:', action.type);
      return;
    }
  }

  // Update last activity on user actions
  if (action.type.startsWith('learning/') || action.type.startsWith('progress/')) {
    store.dispatch({ type: 'auth/updateLastActivity' });
  }

  return next(action);
};
```

### API Middleware

```typescript
// store/middleware/apiMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const apiMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  // Handle API errors globally
  if (action.type.endsWith('/rejected')) {
    const error = action.payload;
    
    // Handle specific error types
    if (error.includes('401') || error.includes('Unauthorized')) {
      // Token expired, redirect to login
      store.dispatch({ type: 'auth/clearAuth' });
      window.location.href = '/login';
    }
    
    if (error.includes('403') || error.includes('Forbidden')) {
      // Insufficient permissions
      console.warn('Access forbidden:', action.type);
    }
  }

  return next(action);
};
```

### Persistence Middleware

```typescript
// store/middleware/persistenceMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const persistenceMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);

  // Persist specific state changes
  if (action.type.startsWith('ui/')) {
    // UI state is automatically persisted by redux-persist
  }

  if (action.type.startsWith('auth/')) {
    // Auth state is automatically persisted by redux-persist
  }

  return result;
};
```

## 🔄 Async Actions

### Thunk Patterns

```typescript
// store/thunks/learningThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { LearningService } from '../../services/learning/learningService';
import { RootState } from '../index';

// Conditional thunk based on state
export const startLearningSession = createAsyncThunk(
  'learning/startSession',
  async (sessionData: StartSessionRequest, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    
    // Check if user is authenticated
    if (!state.auth.isAuthenticated) {
      return rejectWithValue('User must be authenticated');
    }

    // Check if already in a session
    if (state.learning.currentSession) {
      return rejectWithValue('Already in a learning session');
    }

    try {
      const session = await LearningService.startSession(sessionData);
      return session;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to start session');
    }
  }
);

// Thunk with side effects
export const completeLearningSession = createAsyncThunk(
  'learning/completeSession',
  async (sessionId: string, { dispatch, getState, rejectWithValue }) => {
    try {
      const completion = await LearningService.completeSession(sessionId);
      
      // Update progress after session completion
      dispatch({ type: 'progress/refreshProgress' });
      
      // Update session statistics
      dispatch({ type: 'learning/updateSessionStats', payload: completion.stats });
      
      return completion;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to complete session');
    }
  }
);
```

## 💾 State Persistence

### Redux Persist Configuration

```typescript
// store/persistConfig.ts
import { PersistConfig } from 'redux-persist';
import { RootState } from './index';

// Main persist config
export const persistConfig: PersistConfig<RootState> = {
  key: 'lexik3-root',
  storage: localStorage,
  whitelist: ['auth', 'ui', 'books'], // Only persist these slices
  blacklist: ['learning', 'progress'], // Don't persist these slices
};

// Auth-specific persist config
export const authPersistConfig: PersistConfig<AuthState> = {
  key: 'lexik3-auth',
  storage: localStorage,
  whitelist: ['user', 'isAuthenticated'], // Only persist user and auth status
  blacklist: ['isLoading', 'error'], // Don't persist loading states
};

// UI-specific persist config
export const uiPersistConfig: PersistConfig<UIState> = {
  key: 'lexik3-ui',
  storage: localStorage,
  whitelist: ['theme', 'language', 'sidebarOpen'], // Persist user preferences
  blacklist: ['notifications', 'modals', 'loading'], // Don't persist temporary UI state
};
```

### Custom Storage Implementation

```typescript
// store/storage/customStorage.ts
import { Storage } from 'redux-persist';

export const customStorage: Storage = {
  getItem: (key: string): Promise<string | null> => {
    try {
      const item = localStorage.getItem(key);
      return Promise.resolve(item);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return Promise.resolve(null);
    }
  },
  
  setItem: (key: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      console.error('Error setting item in storage:', error);
      return Promise.reject(error);
    }
  },
  
  removeItem: (key: string): Promise<void> => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      console.error('Error removing item from storage:', error);
      return Promise.reject(error);
    }
  },
};
```

## ⚡ Performance Optimization

### Selector Optimization

```typescript
// store/selectors/learningSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Basic selectors
const selectLearningState = (state: RootState) => state.learning;
const selectCurrentSession = (state: RootState) => state.learning.currentSession;
const selectCurrentWordIndex = (state: RootState) => state.learning.currentWordIndex;

// Memoized selectors
export const selectCurrentWord = createSelector(
  [selectCurrentSession, selectCurrentWordIndex],
  (session, wordIndex) => {
    if (!session || !session.words) return null;
    return session.words[wordIndex] || null;
  }
);

export const selectSessionProgress = createSelector(
  [selectCurrentSession, selectCurrentWordIndex],
  (session, wordIndex) => {
    if (!session) return { current: 0, total: 0, percentage: 0 };
    
    const total = session.words.length;
    const current = wordIndex + 1;
    const percentage = total > 0 ? (current / total) * 100 : 0;
    
    return { current, total, percentage };
  }
);

export const selectSessionStats = createSelector(
  [selectLearningState],
  (learning) => learning.sessionStats
);

// Complex selector with multiple dependencies
export const selectLearningSummary = createSelector(
  [selectLearningState, selectCurrentSession, selectSessionProgress],
  (learning, session, progress) => ({
    isActive: !!session,
    progress,
    stats: learning.sessionStats,
    error: learning.error,
    isLoading: learning.isLoading,
  })
);
```

### Component Optimization

```typescript
// components/learning/LearningSession.tsx
import React, { memo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectCurrentWord, selectSessionProgress } from '../../store/selectors/learningSelectors';
import { nextWord, previousWord, submitAnswer } from '../../store/slices/learningSlice';

const LearningSession = memo(() => {
  const dispatch = useAppDispatch();
  const currentWord = useAppSelector(selectCurrentWord);
  const progress = useAppSelector(selectSessionProgress);
  const isLoading = useAppSelector(state => state.learning.isLoading);

  // Memoized callbacks
  const handleNextWord = useCallback(() => {
    dispatch(nextWord());
  }, [dispatch]);

  const handlePreviousWord = useCallback(() => {
    dispatch(previousWord());
  }, [dispatch]);

  const handleSubmitAnswer = useCallback((answer: SessionAnswer) => {
    dispatch(submitAnswer({ sessionId: 'current', answer }));
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading session...</div>;
  }

  if (!currentWord) {
    return <div>No word available</div>;
  }

  return (
    <div className="learning-session">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress.percentage}%` }}
        />
        <span>{progress.current} / {progress.total}</span>
      </div>
      
      <div className="word-card">
        <h2>{currentWord.term}</h2>
        <p>{currentWord.definition}</p>
      </div>
      
      <div className="controls">
        <button onClick={handlePreviousWord}>Previous</button>
        <button onClick={handleNextWord}>Next</button>
      </div>
    </div>
  );
});

LearningSession.displayName = 'LearningSession';
export default LearningSession;
```

## 🧪 Testing State Management

### Testing Reducers

```typescript
// store/slices/__tests__/authSlice.test.ts
import authReducer, { loginUser, logoutUser, clearError } from '../authSlice';
import { AuthState } from '../types';

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    lastActivity: null,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = authReducer(initialState, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loginUser.fulfilled', () => {
    const mockAuthResponse = {
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      expiresAt: '2024-01-01T00:00:00Z',
    };
    
    const action = { 
      type: loginUser.fulfilled.type, 
      payload: mockAuthResponse 
    };
    
    const state = authReducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockAuthResponse.user);
    expect(state.token).toBe(mockAuthResponse.token);
  });

  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const action = { type: clearError.type };
    const state = authReducer(stateWithError, action);
    
    expect(state.error).toBeNull();
  });
});
```

### Testing Async Thunks

```typescript
// store/slices/__tests__/learningSlice.test.ts
import { configureStore } from '@reduxjs/toolkit';
import learningReducer, { startSession } from '../learningSlice';
import { LearningService } from '../../../services/learning/learningService';

// Mock the service
jest.mock('../../../services/learning/learningService');
const mockLearningService = LearningService as jest.Mocked<typeof LearningService>;

describe('learningSlice async thunks', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        learning: learningReducer,
      },
    });
    jest.clearAllMocks();
  });

  it('should handle startSession.fulfilled', async () => {
    const mockSession = {
      sessionId: 'session-1',
      bookId: 'book-1',
      day: 1,
      sessionType: 'daily',
      startedAt: '2024-01-01T00:00:00Z',
      totalWords: 10,
      words: [],
    };

    mockLearningService.startSession.mockResolvedValue(mockSession);

    const sessionData = {
      bookId: 'book-1',
      day: 1,
      sessionType: 'daily' as const,
    };

    await store.dispatch(startSession(sessionData));

    const state = store.getState().learning;
    expect(state.currentSession).toEqual(mockSession);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle startSession.rejected', async () => {
    const errorMessage = 'Failed to start session';
    mockLearningService.startSession.mockRejectedValue(new Error(errorMessage));

    const sessionData = {
      bookId: 'book-1',
      day: 1,
      sessionType: 'daily' as const,
    };

    await store.dispatch(startSession(sessionData));

    const state = store.getState().learning;
    expect(state.currentSession).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Ready for Implementation ✅
