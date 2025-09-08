# LexiK3 Frontend TypeScript Interfaces & Data Models

## 📋 Table of Contents

- [Core Type Definitions](#core-type-definitions)
- [API Response Types](#api-response-types)
- [Authentication Types](#authentication-types)
- [Learning System Types](#learning-system-types)
- [Progress Tracking Types](#progress-tracking-types)
- [UI Component Types](#ui-component-types)
- [State Management Types](#state-management-types)
- [Utility Types](#utility-types)
- [Type Guards](#type-guards)

## 🔧 Core Type Definitions

### Base Types

```typescript
// types/common.ts

// Generic API response wrapper
export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
  timestamp: string;
}

// API error response
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
  timestamp: string;
}

// Pagination information
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

// Generic entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// Generic entity with soft delete
export interface SoftDeletableEntity extends BaseEntity {
  deletedAt?: string;
  isDeleted: boolean;
}

// Generic entity with audit fields
export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
  version: number;
}
```

### Enum Types

```typescript
// types/enums.ts

// Difficulty levels for words and books
export enum DifficultyLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert'
}

// Parts of speech for words
export enum PartOfSpeech {
  Noun = 'noun',
  Verb = 'verb',
  Adjective = 'adjective',
  Adverb = 'adverb',
  Preposition = 'preposition',
  Conjunction = 'conjunction',
  Interjection = 'interjection',
  Pronoun = 'pronoun',
  Determiner = 'determiner',
  Particle = 'particle'
}

// Learning session types
export enum SessionType {
  Daily = 'daily',
  Review = 'review',
  Custom = 'custom',
  Practice = 'practice',
  Test = 'test'
}

// User roles and permissions
export enum UserRole {
  Student = 'student',
  Teacher = 'teacher',
  Admin = 'admin',
  Moderator = 'moderator'
}

// Achievement types
export enum AchievementType {
  Streak = 'streak',
  Progress = 'progress',
  Learning = 'learning',
  Social = 'social',
  Special = 'special'
}

// Notification types
export enum NotificationType {
  Achievement = 'achievement',
  Reminder = 'reminder',
  Progress = 'progress',
  System = 'system',
  Social = 'social'
}

// Theme options
export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto'
}

// Language codes (ISO 639-1)
export enum LanguageCode {
  English = 'en',
  Spanish = 'es',
  French = 'fr',
  German = 'de',
  Italian = 'it',
  Portuguese = 'pt',
  Russian = 'ru',
  Chinese = 'zh',
  Japanese = 'ja',
  Korean = 'ko'
}
```

## 🔐 Authentication Types

```typescript
// types/auth.ts

// User entity
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  preferences: UserPreferences;
  profile?: UserProfile;
}

// User preferences
export interface UserPreferences {
  language: LanguageCode;
  theme: Theme;
  dailyGoal: number;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  learning: LearningPreferences;
}

// Notification settings
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  achievements: boolean;
  reminders: boolean;
  progress: boolean;
  social: boolean;
}

// Privacy settings
export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showProgress: boolean;
  showAchievements: boolean;
  allowFriendRequests: boolean;
}

// Learning preferences
export interface LearningPreferences {
  sessionDuration: number; // minutes
  wordsPerSession: number;
  difficultyPreference: DifficultyLevel;
  autoAdvance: boolean;
  showHints: boolean;
  soundEnabled: boolean;
}

// User profile (optional extended info)
export interface UserProfile {
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  socialLinks?: SocialLinks;
  interests?: string[];
  learningGoals?: string[];
}

// Social links
export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

// Authentication request/response types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  newsletter?: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// JWT payload
export interface JWTPayload {
  sub: string; // User ID
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  iat: number; // Issued at
  exp: number; // Expires at
  iss: string; // Issuer
  aud: string; // Audience
}
```

## 📚 Learning System Types

```typescript
// types/learning.ts

// Book entity
export interface Book extends BaseEntity {
  title: string;
  description: string;
  language: LanguageCode;
  totalWords: number;
  difficulty: DifficultyLevel;
  isPublic: boolean;
  author: string;
  categories: string[];
  estimatedTime: string; // e.g., "30 days"
  tags: string[];
  coverImage?: string;
  userProgress?: UserBookProgress;
  statistics?: BookStatistics;
}

// User's progress with a book
export interface UserBookProgress {
  isEnrolled: boolean;
  wordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  lastStudied?: string;
  completedAt?: string;
  progressPercentage: number;
  averageAccuracy: number;
  totalStudyTime: number; // minutes
  currentDay?: number;
  isCompleted: boolean;
}

// Book statistics
export interface BookStatistics {
  totalEnrollments: number;
  averageRating: number;
  totalRatings: number;
  completionRate: number;
  averageStudyTime: number;
  difficultyRating: number;
}

// Word entity
export interface Word extends BaseEntity {
  bookId: string;
  term: string;
  definition: string;
  pronunciation?: string;
  difficulty: DifficultyLevel;
  partOfSpeech: PartOfSpeech;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  etymology?: string;
  frequency?: number; // Word frequency rank
  tags: string[];
  audioUrl?: string;
  imageUrl?: string;
  userProgress?: WordProgress;
}

// User's progress with a specific word
export interface WordProgress {
  masteryLevel: number; // 1-5 scale
  nextReview: string; // ISO date
  timesReviewed: number;
  timesCorrect: number;
  lastCorrect: boolean;
  lastReviewed?: string;
  totalTimeSpent: number; // seconds
  confidence: number; // 1-5 scale
  isMastered: boolean;
  streak: number;
  difficultyAdjustment: number; // Spaced repetition factor
}

// Learning session
export interface LearningSession extends BaseEntity {
  userId: string;
  bookId: string;
  day?: number;
  sessionType: SessionType;
  startedAt: string;
  completedAt?: string;
  totalWords: number;
  words: SessionWord[];
  answers: SessionAnswer[];
  results: SessionResult[];
  statistics: SessionStatistics;
  isActive: boolean;
}

// Word in a learning session
export interface SessionWord {
  id: string;
  term: string;
  definition: string;
  pronunciation?: string;
  difficulty: DifficultyLevel;
  partOfSpeech: PartOfSpeech;
  examples: string[];
  isNew: boolean;
  userProgress?: WordProgress;
  order: number;
}

// User's answer to a word
export interface SessionAnswer {
  wordId: string;
  answer: string;
  responseTime: number; // seconds
  confidence: number; // 1-5 scale
  submittedAt: string;
  isCorrect?: boolean;
  hintsUsed: number;
  attempts: number;
}

// Result of answering a word
export interface SessionResult {
  wordId: string;
  isCorrect: boolean;
  score: number; // 0-100
  masteryLevel: number;
  nextReview: string;
  feedback: string;
  timeSpent: number; // seconds
  hintsUsed: number;
  attempts: number;
  improvement: number; // Score improvement
}

// Session statistics
export interface SessionStatistics {
  totalWords: number;
  correctAnswers: number;
  accuracy: number;
  averageResponseTime: number;
  totalTime: number; // seconds
  newWords: number;
  reviewWords: number;
  hintsUsed: number;
  score: number; // Overall session score
  improvement: number; // Compared to previous session
}

// Daily words response
export interface DailyWordsResponse {
  day: number;
  bookId: string;
  words: DailyWord[];
  totalWords: number;
  newWords: number;
  reviewWords: number;
  estimatedTime: string;
  isCompleted: boolean;
  completedAt?: string;
}

// Word for daily learning
export interface DailyWord extends SessionWord {
  isCompleted: boolean;
  completedAt?: string;
  score?: number;
}

// Start session request
export interface StartSessionRequest {
  bookId: string;
  day?: number;
  sessionType: SessionType;
  wordCount?: number;
  difficultyFilter?: DifficultyLevel[];
  includeNewWords?: boolean;
  includeReviewWords?: boolean;
}

// Submit answer request
export interface SubmitAnswerRequest {
  wordId: string;
  answer: string;
  responseTime: number;
  confidence: number;
  hintsUsed?: number;
  attempts?: number;
}
```

## 📊 Progress Tracking Types

```typescript
// types/progress.ts

// Overall user progress
export interface UserProgress {
  userId: string;
  overall: OverallProgress;
  byBook: BookProgress[];
  recentActivity: DailyActivity[];
  achievements: Achievement[];
  statistics: LearningStatistics;
  lastUpdated: string;
}

// Overall progress summary
export interface OverallProgress {
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number; // minutes
  accuracy: number; // 0-1
  level: string; // e.g., "Intermediate"
  experience: number; // XP points
  rank: number; // User ranking
  percentile: number; // Percentile ranking
}

// Progress for a specific book
export interface BookProgress {
  bookId: string;
  bookTitle: string;
  wordsLearned: number;
  totalWords: number;
  progress: number; // 0-1
  currentStreak: number;
  lastStudied?: string;
  isCompleted: boolean;
  completedAt?: string;
  averageAccuracy: number;
  totalStudyTime: number; // minutes
  currentDay?: number;
  estimatedCompletion?: string;
}

// Daily activity record
export interface DailyActivity {
  date: string; // YYYY-MM-DD
  wordsStudied: number;
  accuracy: number;
  studyTime: number; // minutes
  sessionsCompleted: number;
  newWordsLearned: number;
  wordsReviewed: number;
  streakMaintained: boolean;
  achievementsUnlocked: number;
  booksStudied: string[];
}

// Achievement system
export interface Achievement extends BaseEntity {
  name: string;
  description: string;
  type: AchievementType;
  category: string;
  icon: string;
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: AchievementRequirement[];
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0-1
  isSecret: boolean;
}

// Achievement requirements
export interface AchievementRequirement {
  type: 'streak' | 'words' | 'accuracy' | 'time' | 'books' | 'sessions';
  value: number;
  description: string;
  isCompleted: boolean;
}

// Learning statistics
export interface LearningStatistics {
  studyTime: StudyTimeStats;
  accuracy: AccuracyStats;
  words: WordStats;
  streaks: StreakStats;
  sessions: SessionStats;
  trends: TrendStats;
}

// Study time statistics
export interface StudyTimeStats {
  total: number; // minutes
  averagePerDay: number;
  averagePerSession: number;
  byDayOfWeek: Record<string, number>;
  byHourOfDay: Record<string, number>;
  longestSession: number;
  totalSessions: number;
}

// Accuracy statistics
export interface AccuracyStats {
  overall: number; // 0-1
  byDifficulty: Record<DifficultyLevel, number>;
  byPartOfSpeech: Record<PartOfSpeech, number>;
  trend: 'improving' | 'stable' | 'declining';
  bestDay: string;
  worstDay: string;
  averageImprovement: number;
}

// Word statistics
export interface WordStats {
  totalLearned: number;
  newThisWeek: number;
  reviewedThisWeek: number;
  mastered: number;
  inProgress: number;
  masteryDistribution: Record<string, number>;
  averageTimeToMaster: number; // days
  retentionRate: number; // 0-1
}

// Streak statistics
export interface StreakStats {
  current: number;
  longest: number;
  average: number;
  total: number;
  bestMonth: string;
  consistency: number; // 0-1
}

// Session statistics
export interface SessionStats {
  total: number;
  averagePerDay: number;
  averageDuration: number; // minutes
  completionRate: number; // 0-1
  bestSession: SessionStatistics;
  averageScore: number;
  improvementRate: number; // 0-1
}

// Trend statistics
export interface TrendStats {
  weeklyGrowth: number; // percentage
  monthlyGrowth: number; // percentage
  accuracyTrend: number; // slope
  timeTrend: number; // slope
  wordTrend: number; // slope
  streakTrend: number; // slope
}

// Progress query parameters
export interface ProgressQueryParams {
  period?: 'week' | 'month' | 'year' | 'all';
  bookId?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}

// Daily progress request
export interface DailyProgressRequest {
  bookId: string;
  day: number;
  completedAt: string;
  wordsStudied: number;
  accuracy: number;
  studyTime: number; // minutes
}
```

## 🎨 UI Component Types

```typescript
// types/ui.ts

// Theme configuration
export interface ThemeConfig {
  mode: Theme;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  borderColor: string;
  shadowColor: string;
}

// Component props interfaces
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
  href?: string;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  loading?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  className?: string;
  overlay?: boolean;
}

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

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  children?: NavigationItem[];
  badge?: string | number;
  disabled?: boolean;
  hidden?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// Form types
export interface FormField<T = any> {
  name: keyof T;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: ValidationRule[];
  disabled?: boolean;
  hidden?: boolean;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

// Table types
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  rowKey?: keyof T | ((record: T) => string);
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  scales?: {
    x?: ScaleOptions;
    y?: ScaleOptions;
  };
  plugins?: {
    legend?: LegendOptions;
    tooltip?: TooltipOptions;
  };
}

export interface ScaleOptions {
  beginAtZero?: boolean;
  min?: number;
  max?: number;
  ticks?: {
    stepSize?: number;
    callback?: (value: any) => string;
  };
}

export interface LegendOptions {
  display?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TooltipOptions {
  enabled?: boolean;
  mode?: 'point' | 'nearest' | 'index' | 'dataset';
  intersect?: boolean;
}
```

## 🗃️ State Management Types

```typescript
// types/store.ts

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
  enrolledBooks: Book[];
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
  difficulty?: DifficultyLevel;
  category?: string;
  isPublic?: boolean;
  hasProgress?: boolean;
  tags?: string[];
}

// Learning state
export interface LearningState {
  currentSession: LearningSession | null;
  sessionHistory: LearningSession[];
  currentWordIndex: number;
  answers: SessionAnswer[];
  results: SessionResult[];
  isLoading: boolean;
  error: string | null;
  sessionStats: SessionStatistics;
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
  notifications: Notification[];
  modals: ModalState;
  toasts: ToastProps[];
  loading: LoadingStates;
  errors: ErrorState;
  preferences: UIPreferences;
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

// Thunk action types
export interface ThunkAction<R, S, E, A extends Action> {
  (dispatch: ThunkDispatch<S, E, A>, getState: () => S, extraArgument: E): R;
}

export interface ThunkDispatch<S, E, A extends Action> {
  <T extends A>(action: T): T;
  <R>(asyncAction: ThunkAction<R, S, E, A>): R;
}
```

## 🛠️ Utility Types

```typescript
// types/utils.ts

// Generic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// API utility types
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type ApiStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// Form utility types
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type FormTouched<T> = {
  [K in keyof T]?: boolean;
};

export type FormValues<T> = {
  [K in keyof T]: T[K];
};

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
export type ClickHandler<T = HTMLButtonElement> = (event: React.MouseEvent<T>) => void;
export type SubmitHandler<T = HTMLFormElement> = (event: React.FormEvent<T>) => void;

// Component prop types
export type ComponentProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];
export type ReactComponent<T = {}> = React.ComponentType<T>;
export type ReactElement = React.ReactElement;
export type ReactNode = React.ReactNode;

// Function types
export type AsyncFunction<T = any, R = any> = (arg: T) => Promise<R>;
export type SyncFunction<T = any, R = any> = (arg: T) => R;
export type VoidFunction = () => void;
export type Predicate<T = any> = (arg: T) => boolean;

// Array utility types
export type NonEmptyArray<T> = [T, ...T[]];
export type ArrayElement<T> = T extends (infer U)[] ? U : never;
export type ArrayLength<T extends readonly any[]> = T['length'];

// Object utility types
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type ValuesOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? T[K] : never;
}[keyof T];

// String utility types
export type StringKeys<T> = Extract<keyof T, string>;
export type StringValues<T> = T[StringKeys<T>];

// Number utility types
export type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

// Date utility types
export type DateString = string; // ISO 8601 date string
export type Timestamp = number; // Unix timestamp
export type DateRange = {
  start: DateString;
  end: DateString;
};

// ID utility types
export type ID = string;
export type UUID = string;
export type Slug = string;

// URL utility types
export type URL = string;
export type Path = string;
export type QueryParams = Record<string, string | number | boolean>;

// Size utility types
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Color utility types
export type Color = string;
export type HexColor = `#${string}`;
export type RGBColor = `rgb(${number}, ${number}, ${number})`;
export type RGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`;

// Status utility types
export type Status = 'idle' | 'loading' | 'success' | 'error';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Severity = 'info' | 'warning' | 'error' | 'success';
```

## 🔍 Type Guards

```typescript
// types/guards.ts

// API response type guards
export const isApiResponse = <T>(response: any): response is ApiResponse<T> => {
  return response && typeof response === 'object' && response.success === true;
};

export const isApiError = (response: any): response is ApiError => {
  return response && typeof response === 'object' && response.success === false;
};

// User type guards
export const isUser = (user: any): user is User => {
  return user && 
    typeof user === 'object' && 
    typeof user.id === 'string' && 
    typeof user.email === 'string' && 
    typeof user.firstName === 'string' && 
    typeof user.lastName === 'string';
};

export const isAuthenticatedUser = (user: any): user is User => {
  return isUser(user) && user.isEmailVerified === true;
};

// Book type guards
export const isBook = (book: any): book is Book => {
  return book && 
    typeof book === 'object' && 
    typeof book.id === 'string' && 
    typeof book.title === 'string' && 
    typeof book.description === 'string';
};

export const isPublicBook = (book: any): book is Book => {
  return isBook(book) && book.isPublic === true;
};

// Word type guards
export const isWord = (word: any): word is Word => {
  return word && 
    typeof word === 'object' && 
    typeof word.id === 'string' && 
    typeof word.term === 'string' && 
    typeof word.definition === 'string';
};

// Learning session type guards
export const isLearningSession = (session: any): session is LearningSession => {
  return session && 
    typeof session === 'object' && 
    typeof session.id === 'string' && 
    typeof session.userId === 'string' && 
    typeof session.bookId === 'string' && 
    Array.isArray(session.words);
};

export const isActiveSession = (session: any): session is LearningSession => {
  return isLearningSession(session) && session.isActive === true;
};

// Progress type guards
export const isUserProgress = (progress: any): progress is UserProgress => {
  return progress && 
    typeof progress === 'object' && 
    typeof progress.userId === 'string' && 
    typeof progress.overall === 'object' && 
    Array.isArray(progress.byBook);
};

// Achievement type guards
export const isAchievement = (achievement: any): achievement is Achievement => {
  return achievement && 
    typeof achievement === 'object' && 
    typeof achievement.id === 'string' && 
    typeof achievement.name === 'string' && 
    typeof achievement.description === 'string';
};

export const isUnlockedAchievement = (achievement: any): achievement is Achievement => {
  return isAchievement(achievement) && achievement.isUnlocked === true;
};

// Error type guards
export const isNetworkError = (error: any): error is Error => {
  return error instanceof Error && 
    (error.message.includes('Network Error') || 
     error.message.includes('fetch'));
};

export const isValidationError = (error: any): error is ApiError => {
  return isApiError(error) && error.error.code === 'VALIDATION_ERROR';
};

export const isAuthError = (error: any): error is ApiError => {
  return isApiError(error) && 
    (error.error.code === 'AUTHENTICATION_FAILED' || 
     error.error.code === 'UNAUTHORIZED');
};

// Form type guards
export const hasFormErrors = <T>(errors: FormErrors<T>): boolean => {
  return Object.values(errors).some(error => error !== undefined);
};

export const isFormValid = <T>(errors: FormErrors<T>): boolean => {
  return !hasFormErrors(errors);
};

// Array type guards
export const isNonEmptyArray = <T>(array: T[]): array is NonEmptyArray<T> => {
  return Array.isArray(array) && array.length > 0;
};

export const isStringArray = (array: any): array is string[] => {
  return Array.isArray(array) && array.every(item => typeof item === 'string');
};

export const isNumberArray = (array: any): array is number[] => {
  return Array.isArray(array) && array.every(item => typeof item === 'number');
};

// Date type guards
export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const isValidDateString = (dateString: any): dateString is DateString => {
  return typeof dateString === 'string' && 
    !isNaN(Date.parse(dateString));
};

// URL type guards
export const isValidUrl = (url: any): url is URL => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Environment type guards
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Ready for Implementation ✅
