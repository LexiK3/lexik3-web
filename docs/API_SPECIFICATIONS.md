# LexiK3 Frontend API Specifications

## 📋 Table of Contents

- [API Overview](#api-overview)
- [Authentication Endpoints](#authentication-endpoints)
- [User Management Endpoints](#user-management-endpoints)
- [Books Endpoints](#books-endpoints)
- [Words Endpoints](#words-endpoints)
- [Learning Sessions Endpoints](#learning-sessions-endpoints)
- [Progress Endpoints](#progress-endpoints)
- [Statistics Endpoints](#statistics-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Pagination](#pagination)

## 🔌 API Overview

### Base Configuration
- **Production URL**: `https://api.lexik3.com/v1`
- **Development URL**: `https://localhost:7001`
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer Token
- **Response Format**: Consistent JSON structure

### Standard Response Format

#### Success Response
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
  timestamp: string;
}
```

#### Error Response
```typescript
interface ApiError {
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
```

## 🔐 Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}
```

**Response:**
- **201 Created**: User registered successfully
- **400 Bad Request**: Validation errors
- **409 Conflict**: Email already exists

**Success Response:**
```typescript
interface RegisterResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  emailConfirmed: boolean;
}
```

**Frontend Implementation:**
```typescript
// services/auth/authService.ts
export const registerUser = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post<ApiResponse<RegisterResponse>>('/api/auth/register', userData);
  return response.data.data;
};
```

### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:**
- **200 OK**: Login successful
- **400 Bad Request**: Invalid request
- **401 Unauthorized**: Invalid credentials

**Success Response:**
```typescript
interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}
```

**Frontend Implementation:**
```typescript
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
  return response.data.data;
};
```

### POST /api/auth/refresh
Refresh expired JWT token.

**Request Body:**
```typescript
interface RefreshTokenRequest {
  refreshToken: string;
}
```

**Response:**
- **200 OK**: Token refreshed successfully
- **401 Unauthorized**: Invalid refresh token

**Frontend Implementation:**
```typescript
export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/refresh', {
    refreshToken
  });
  return response.data.data;
};
```

### POST /api/auth/logout
Logout user and invalidate token.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
- **200 OK**: Logout successful

**Frontend Implementation:**
```typescript
export const logoutUser = async (): Promise<void> => {
  await apiClient.post('/api/auth/logout');
};
```

## 👤 User Management Endpoints

### GET /api/users/profile
Get current user's profile information.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
- **200 OK**: Profile retrieved successfully
- **401 Unauthorized**: Invalid or missing token

**Success Response:**
```typescript
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastLoginAt: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  language: string;
  dailyGoal: number;
  notifications: boolean;
}
```

**Frontend Implementation:**
```typescript
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<ApiResponse<UserProfile>>('/api/users/profile');
  return response.data.data;
};
```

### PUT /api/users/profile
Update user's profile information.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```typescript
interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  preferences: UserPreferences;
}
```

**Response:**
- **200 OK**: Profile updated successfully
- **400 Bad Request**: Validation errors
- **401 Unauthorized**: Invalid or missing token

**Frontend Implementation:**
```typescript
export const updateUserProfile = async (profileData: UpdateProfileRequest): Promise<UserProfile> => {
  const response = await apiClient.put<ApiResponse<UserProfile>>('/api/users/profile', profileData);
  return response.data.data;
};
```

## 📚 Books Endpoints

### GET /api/books
Get all available vocabulary books.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)
- `language` (optional): Filter by language code
- `search` (optional): Search term for title/description

**Response:**
- **200 OK**: Books retrieved successfully

**Success Response:**
```typescript
interface BooksResponse {
  books: Book[];
  pagination: PaginationInfo;
}

interface Book {
  id: string;
  title: string;
  description: string;
  language: string;
  totalWords: number;
  difficulty: DifficultyLevel;
  createdAt: string;
  isPublic: boolean;
  author: string;
  categories: string[];
  estimatedTime: string;
  userProgress?: UserBookProgress;
}

interface UserBookProgress {
  isEnrolled: boolean;
  wordsLearned: number;
  currentStreak: number;
  lastStudied: string;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

**Frontend Implementation:**
```typescript
export const getBooks = async (params?: {
  page?: number;
  pageSize?: number;
  language?: string;
  search?: string;
}): Promise<BooksResponse> => {
  const response = await apiClient.get<ApiResponse<BooksResponse>>('/api/books', { params });
  return response.data.data;
};
```

### GET /api/books/{id}
Get detailed information about a specific book.

**Path Parameters:**
- `id`: Book identifier

**Response:**
- **200 OK**: Book retrieved successfully
- **404 Not Found**: Book not found

**Success Response:**
```typescript
interface BookDetail extends Book {
  userProgress?: UserBookProgress;
}
```

**Frontend Implementation:**
```typescript
export const getBookById = async (id: string): Promise<BookDetail> => {
  const response = await apiClient.get<ApiResponse<BookDetail>>(`/api/books/${id}`);
  return response.data.data;
};
```

### POST /api/books/{id}/enroll
Enroll current user in a vocabulary book.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `id`: Book identifier

**Response:**
- **200 OK**: Successfully enrolled
- **400 Bad Request**: Already enrolled or invalid book
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Book not found

**Frontend Implementation:**
```typescript
export const enrollInBook = async (bookId: string): Promise<void> => {
  await apiClient.post(`/api/books/${bookId}/enroll`);
};
```

### DELETE /api/books/{id}/enroll
Remove current user from a vocabulary book.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `id`: Book identifier

**Response:**
- **200 OK**: Successfully unenrolled
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Book not found or not enrolled

**Frontend Implementation:**
```typescript
export const unenrollFromBook = async (bookId: string): Promise<void> => {
  await apiClient.delete(`/api/books/${bookId}/enroll`);
};
```

## 📝 Words Endpoints

### GET /api/books/{bookId}/words
Get words for a specific book.

**Path Parameters:**
- `bookId`: Book identifier

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 20)
- `difficulty` (optional): Filter by difficulty level
- `search` (optional): Search term for word/definition

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
- **200 OK**: Words retrieved successfully
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Book not found

**Success Response:**
```typescript
interface WordsResponse {
  words: Word[];
  pagination: PaginationInfo;
}

interface Word {
  id: string;
  term: string;
  definition: string;
  pronunciation: string;
  difficulty: DifficultyLevel;
  partOfSpeech: PartOfSpeech;
  examples: string[];
  synonyms: string[];
  userProgress?: WordProgress;
}

interface WordProgress {
  masteryLevel: number;
  nextReview: string;
  timesReviewed: number;
  lastCorrect: boolean;
}
```

**Frontend Implementation:**
```typescript
export const getBookWords = async (bookId: string, params?: {
  page?: number;
  pageSize?: number;
  difficulty?: DifficultyLevel;
  search?: string;
}): Promise<WordsResponse> => {
  const response = await apiClient.get<ApiResponse<WordsResponse>>(`/api/books/${bookId}/words`, { params });
  return response.data.data;
};
```

### GET /api/words/{id}
Get detailed information about a specific word.

**Path Parameters:**
- `id`: Word identifier

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
- **200 OK**: Word retrieved successfully
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Word not found

**Frontend Implementation:**
```typescript
export const getWordById = async (id: string): Promise<Word> => {
  const response = await apiClient.get<ApiResponse<Word>>(`/api/words/${id}`);
  return response.data.data;
};
```

## 🎓 Learning Sessions Endpoints

### GET /api/books/{bookId}/days/{day}/words
Get words scheduled for a specific day.

**Path Parameters:**
- `bookId`: Book identifier
- `day`: Day number (1-based)

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
- **200 OK**: Words retrieved successfully
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Book not found or day not available

**Success Response:**
```typescript
interface DailyWordsResponse {
  day: number;
  bookId: string;
  words: DailyWord[];
  totalWords: number;
  newWords: number;
  reviewWords: number;
  estimatedTime: string;
}

interface DailyWord {
  id: string;
  term: string;
  definition: string;
  pronunciation: string;
  difficulty: DifficultyLevel;
  partOfSpeech: PartOfSpeech;
  examples: string[];
  isNew: boolean;
  userProgress?: WordProgress;
}
```

**Frontend Implementation:**
```typescript
export const getDailyWords = async (bookId: string, day: number): Promise<DailyWordsResponse> => {
  const response = await apiClient.get<ApiResponse<DailyWordsResponse>>(`/api/books/${bookId}/days/${day}/words`);
  return response.data.data;
};
```

### POST /api/learning-sessions
Start a new learning session.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```typescript
interface StartSessionRequest {
  bookId: string;
  day: number;
  sessionType: SessionType;
}
```

**Response:**
- **201 Created**: Session started successfully
- **400 Bad Request**: Invalid request
- **401 Unauthorized**: Invalid or missing token

**Success Response:**
```typescript
interface LearningSession {
  sessionId: string;
  bookId: string;
  day: number;
  sessionType: SessionType;
  startedAt: string;
  totalWords: number;
  words: SessionWord[];
}

interface SessionWord {
  id: string;
  term: string;
  definition: string;
  isNew: boolean;
}
```

**Frontend Implementation:**
```typescript
export const startLearningSession = async (sessionData: StartSessionRequest): Promise<LearningSession> => {
  const response = await apiClient.post<ApiResponse<LearningSession>>('/api/learning-sessions', sessionData);
  return response.data.data;
};
```

### POST /api/learning-sessions/{sessionId}/answers
Submit an answer for a word in the current session.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `sessionId`: Session identifier

**Request Body:**
```typescript
interface SubmitAnswerRequest {
  wordId: string;
  answer: string;
  responseTime: number; // seconds
  confidence: number; // 1-5 scale
}
```

**Response:**
- **200 OK**: Answer submitted successfully
- **400 Bad Request**: Invalid request
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Session not found

**Success Response:**
```typescript
interface SessionResult {
  wordId: string;
  isCorrect: boolean;
  score: number;
  masteryLevel: number;
  nextReview: string;
  feedback: string;
}
```

**Frontend Implementation:**
```typescript
export const submitAnswer = async (sessionId: string, answer: SubmitAnswerRequest): Promise<SessionResult> => {
  const response = await apiClient.post<ApiResponse<SessionResult>>(`/api/learning-sessions/${sessionId}/answers`, answer);
  return response.data.data;
};
```

### POST /api/learning-sessions/{sessionId}/complete
Complete a learning session.

**Headers:**
- `Authorization: Bearer <token>`

**Path Parameters:**
- `sessionId`: Session identifier

**Response:**
- **200 OK**: Session completed successfully
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Session not found

**Success Response:**
```typescript
interface SessionCompletion {
  sessionId: string;
  completedAt: string;
  duration: string;
  wordsStudied: number;
  correctAnswers: number;
  accuracy: number;
  score: number;
  streakUpdated: boolean;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
}
```

**Frontend Implementation:**
```typescript
export const completeLearningSession = async (sessionId: string): Promise<SessionCompletion> => {
  const response = await apiClient.post<ApiResponse<SessionCompletion>>(`/api/learning-sessions/${sessionId}/complete`);
  return response.data.data;
};
```

## 📊 Progress Endpoints

### GET /api/progress
Get user's overall learning progress.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (optional): Time period ("week", "month", "year", "all")
- `bookId` (optional): Filter by specific book

**Response:**
- **200 OK**: Progress retrieved successfully
- **401 Unauthorized**: Invalid or missing token

**Success Response:**
```typescript
interface UserProgress {
  overall: OverallProgress;
  byBook: BookProgress[];
  recentActivity: DailyActivity[];
  achievements: Achievement[];
}

interface OverallProgress {
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: string;
  accuracy: number;
  level: string;
}

interface BookProgress {
  bookId: string;
  bookTitle: string;
  wordsLearned: number;
  totalWords: number;
  progress: number;
  currentStreak: number;
  lastStudied: string;
}

interface DailyActivity {
  date: string;
  wordsStudied: number;
  accuracy: number;
  studyTime: string;
}
```

**Frontend Implementation:**
```typescript
export const getUserProgress = async (params?: {
  period?: 'week' | 'month' | 'year' | 'all';
  bookId?: string;
}): Promise<UserProgress> => {
  const response = await apiClient.get<ApiResponse<UserProgress>>('/api/progress', { params });
  return response.data.data;
};
```

### GET /api/progress/daily
Get daily progress for a specific date range.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601 format)
- `endDate` (optional): End date (ISO 8601 format)
- `bookId` (optional): Filter by specific book

**Response:**
- **200 OK**: Daily progress retrieved successfully
- **401 Unauthorized**: Invalid or missing token

**Success Response:**
```typescript
interface DailyProgressResponse {
  dailyProgress: DailyActivity[];
  summary: {
    totalDays: number;
    activeDays: number;
    totalWords: number;
    averageAccuracy: number;
  };
}
```

**Frontend Implementation:**
```typescript
export const getDailyProgress = async (params?: {
  startDate?: string;
  endDate?: string;
  bookId?: string;
}): Promise<DailyProgressResponse> => {
  const response = await apiClient.get<ApiResponse<DailyProgressResponse>>('/api/progress/daily', { params });
  return response.data.data;
};
```

## 📈 Statistics Endpoints

### GET /api/statistics
Get detailed learning statistics.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (optional): Time period ("week", "month", "year", "all")
- `bookId` (optional): Filter by specific book

**Response:**
- **200 OK**: Statistics retrieved successfully
- **401 Unauthorized**: Invalid or missing token

**Success Response:**
```typescript
interface LearningStatistics {
  studyTime: {
    total: string;
    averagePerDay: string;
    byDayOfWeek: Record<string, string>;
  };
  accuracy: {
    overall: number;
    byDifficulty: Record<DifficultyLevel, number>;
    trend: 'improving' | 'stable' | 'declining';
  };
  words: {
    totalLearned: number;
    newThisWeek: number;
    reviewedThisWeek: number;
    masteryDistribution: Record<string, number>;
  };
  streaks: {
    current: number;
    longest: number;
    average: number;
  };
}
```

**Frontend Implementation:**
```typescript
export const getLearningStatistics = async (params?: {
  period?: 'week' | 'month' | 'year' | 'all';
  bookId?: string;
}): Promise<LearningStatistics> => {
  const response = await apiClient.get<ApiResponse<LearningStatistics>>('/api/statistics', { params });
  return response.data.data;
};
```

## ❌ Error Handling

### Error Codes

| Code | Description | Frontend Action |
|------|-------------|-----------------|
| `VALIDATION_ERROR` | Input validation failed | Show field-specific error messages |
| `AUTHENTICATION_FAILED` | Invalid credentials | Show login error, clear form |
| `UNAUTHORIZED` | Missing or invalid token | Redirect to login page |
| `FORBIDDEN` | Insufficient permissions | Show access denied message |
| `NOT_FOUND` | Resource not found | Show 404 page or error message |
| `CONFLICT` | Resource already exists | Show conflict message with options |
| `RATE_LIMITED` | Too many requests | Show rate limit message, disable actions |
| `INTERNAL_ERROR` | Server error | Show generic error, log details |

### Error Handling Implementation

```typescript
// utils/errorHandler.ts
export class ApiErrorHandler {
  static handle(error: any): string {
    if (error.response?.data?.error) {
      const { code, message, details } = error.response.data.error;
      
      switch (code) {
        case 'VALIDATION_ERROR':
          return this.handleValidationError(details);
        case 'AUTHENTICATION_FAILED':
          return 'Invalid email or password. Please try again.';
        case 'UNAUTHORIZED':
          // Redirect to login
          window.location.href = '/login';
          return 'Please log in to continue.';
        case 'RATE_LIMITED':
          return 'Too many requests. Please wait a moment and try again.';
        default:
          return message || 'An unexpected error occurred.';
      }
    }
    
    return 'Network error. Please check your connection and try again.';
  }
  
  private static handleValidationError(details: any[]): string {
    if (details && details.length > 0) {
      return details.map(d => d.message).join(', ');
    }
    return 'Please check your input and try again.';
  }
}
```

## ⚡ Rate Limiting

### Rate Limits
- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **Learning session endpoints**: 10 requests per minute per user

### Rate Limit Headers
```typescript
interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
}
```

### Frontend Rate Limit Handling

```typescript
// services/api/rateLimitService.ts
export class RateLimitService {
  static handleRateLimit(headers: any): void {
    const remaining = parseInt(headers['X-RateLimit-Remaining'] || '0');
    const resetTime = parseInt(headers['X-RateLimit-Reset'] || '0');
    
    if (remaining < 5) {
      // Show warning to user
      this.showRateLimitWarning(remaining, resetTime);
    }
  }
  
  private static showRateLimitWarning(remaining: number, resetTime: number): void {
    const resetDate = new Date(resetTime * 1000);
    const message = `Rate limit warning: ${remaining} requests remaining. Resets at ${resetDate.toLocaleTimeString()}`;
    
    // Show toast notification or modal
    console.warn(message);
  }
}
```

## 📄 Pagination

### Pagination Parameters
- `page`: Page number (1-based, default: 1)
- `pageSize`: Items per page (default: 10, max: 100)

### Pagination Response
```typescript
interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

### Frontend Pagination Component

```typescript
// components/common/Pagination.tsx
interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { page, totalPages, hasNext, hasPrevious } = pagination;
  
  return (
    <div className="pagination">
      <button 
        disabled={!hasPrevious} 
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      
      <span>Page {page} of {totalPages}</span>
      
      <button 
        disabled={!hasNext} 
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Ready for Implementation ✅
