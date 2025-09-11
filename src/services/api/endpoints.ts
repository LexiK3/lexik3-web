// services/api/endpoints.ts
// Centralized API endpoints configuration

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },

  // User Management
  USER: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    PREFERENCES: '/api/users/preferences',
  },

  // Books
  BOOKS: {
    LIST: '/api/books',
    DETAIL: (id: string) => `/api/books/${id}`,
    ENROLL: (id: string) => `/api/books/${id}/enroll`,
    UNENROLL: (id: string) => `/api/books/${id}/enroll`,
    WORDS: (id: string) => `/api/books/${id}/words`,
    DAILY_WORDS: (bookId: string, day: number) => `/api/books/${bookId}/days/${day}/words`,
  },

  // Words
  WORDS: {
    DETAIL: (id: string) => `/api/words/${id}`,
  },

  // Learning Sessions
  LEARNING: {
    START_SESSION: '/api/learning/sessions',
    SUBMIT_ANSWER: (sessionId: string) => `/api/learning/sessions/${sessionId}/answers`,
    COMPLETE_SESSION: (sessionId: string) => `/api/learning/sessions/${sessionId}/complete`,
    SESSION_HISTORY: '/api/learning/sessions/history',
  },

  // Progress
  PROGRESS: {
    OVERALL: '/api/progress',
    DAILY: '/api/progress/daily',
    STATISTICS: '/api/statistics',
    ACHIEVEMENTS: '/api/achievements',
  },
} as const;
