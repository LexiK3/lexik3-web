// types/store.ts
import { User, AuthResponse } from './auth';
import { Book } from './learning';
import { UserProgress, DailyActivity, LearningStatistics, Achievement } from './progress';
import { PaginationInfo } from './common';

// Re-export PaginationInfo for use in other files
export type { PaginationInfo };
import { Theme, LanguageCode, NotificationType } from './enums';

// Root state interface
export interface RootState {
  auth: AuthState;
  books: BooksState;
  learning: LearningState;
  progress: ProgressState;
  ui: UIState;
}

// Auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: string | null;
  loginAttempts: number;
  isRefreshing: boolean;
}

// Books state
export interface BooksState {
  books: Book[];
  currentBook: Book | null;
  enrolledBooks: any[]; // BookEnrollment[]
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: BookFilters;
  searchQuery: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

// Book filters
export interface BookFilters {
  language?: LanguageCode;
  difficulty?: string;
  category?: string;
  categories?: string[];
  isPublic?: boolean;
  hasProgress?: boolean;
  tags?: string[];
}

// Learning state
export interface LearningState {
  currentSession: any | null; // LearningSession
  sessionHistory: any[]; // LearningSession[]
  currentWordIndex: number;
  answers: any[]; // SessionAnswer[]
  results: any[]; // SessionResult[]
  isLoading: boolean;
  error: string | null;
  sessionStats: any; // SessionStatistics
  isPaused: boolean;
  pauseTime?: number;
  hintsUsed: number;
  totalHints: number;
}

// Progress state
export interface ProgressState {
  userProgress: UserProgress | null;
  dailyProgress: DailyActivity[];
  statistics: LearningStatistics | null;
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  selectedPeriod: 'week' | 'month' | 'year' | 'all';
  selectedBook?: string;
}

// UI state
export interface UIState {
  theme: Theme;
  language: LanguageCode;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  notifications: Notification[];
  modals: ModalState;
  toasts: ToastProps[];
  loading: LoadingStates;
  errors: ErrorState;
  preferences: UIPreferences;
  isLoading: boolean;
  error: string | null;
}

// Loading states
export interface LoadingStates {
  global: boolean;
  auth: boolean;
  books: boolean;
  learning: boolean;
  progress: boolean;
  profile: boolean;
}

// Error state
export interface ErrorState {
  global: string | null;
  auth: string | null;
  books: string | null;
  learning: string | null;
  progress: string | null;
  network: string | null;
}

// Modal state
export interface ModalState {
  [key: string]: {
    isOpen: boolean;
    data?: any;
  };
}

// UI preferences
export interface UIPreferences {
  sidebarCollapsed: boolean;
  compactMode: boolean;
  showTutorials: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
  autoRefresh: boolean;
}

// Notification
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  data?: any;
}

// Toast props
export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: ToastAction;
  position?: 'top' | 'bottom';
}

export interface ToastAction {
  label: string;
  onClick: () => void;
}

// Action types for Redux
export interface Action<T = any> {
  type: string;
  payload?: T;
  meta?: any;
  error?: boolean;
}

// Async action states
export interface AsyncState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetched?: string;
}
