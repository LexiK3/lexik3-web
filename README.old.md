# LexiK3 Frontend Developer Documentation

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Frontend Responsibilities](#frontend-responsibilities)
- [API Integration](#api-integration)
- [Data Models & Types](#data-models--types)
- [Authentication Flow](#authentication-flow)
- [State Management](#state-management)
- [UI/UX Requirements](#uiux-requirements)
- [Setup & Development](#setup--development)
- [Development Guidelines](#development-guidelines)

## 🎯 Project Overview

LexiK3 is a comprehensive vocabulary learning application with a robust .NET Core 8 backend API and multi-platform frontend support. The frontend is responsible for delivering an intuitive, engaging user experience for vocabulary learning with spaced repetition algorithms.

### Key Features
- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Vocabulary Learning**: Interactive learning sessions with spaced repetition
- **Progress Tracking**: Real-time progress monitoring and analytics
- **Multi-Platform**: Support for web (React), mobile (Flutter), and other clients
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Technology Stack
- **Frontend Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit or Zustand
- **UI Library**: Material-UI or Tailwind CSS
- **HTTP Client**: Axios or Fetch API
- **Authentication**: JWT token management
- **Testing**: Jest, React Testing Library, Cypress

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐    ┌──────────────────────┐    ┌─────────────────┐
│   Frontend      │◄──►│   ASP.NET Core API   │◄──►│  PostgreSQL DB  │
│  (React/Flutter)│    │   (Containerized)    │    │                 │
└─────────────────┘    └──────────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Redis Cache   │
                       │  (Optional)     │
                       └─────────────────┘
```

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, etc.)
│   ├── auth/           # Authentication components
│   ├── learning/       # Learning session components
│   ├── progress/       # Progress tracking components
│   └── layout/         # Layout components (Header, Sidebar, etc.)
├── pages/              # Page components
│   ├── Auth/           # Login, Register pages
│   ├── Dashboard/      # Main dashboard
│   ├── Learning/       # Learning session pages
│   └── Progress/       # Progress and statistics pages
├── services/           # API services and utilities
│   ├── api/            # API client configuration
│   ├── auth/           # Authentication services
│   └── storage/        # Local storage utilities
├── store/              # State management
│   ├── slices/         # Redux slices or Zustand stores
│   └── middleware/     # Custom middleware
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── constants/          # Application constants
```

## 🎯 Frontend Responsibilities

### Core Responsibilities
1. **User Interface**: Create intuitive, responsive UI components
2. **State Management**: Manage application state and data flow
3. **API Integration**: Handle all backend communication
4. **Authentication**: Implement secure login/logout flows
5. **Data Validation**: Client-side input validation
6. **Error Handling**: User-friendly error messages and recovery
7. **Performance**: Optimize loading times and user experience
8. **Accessibility**: Ensure WCAG compliance

### Key Workflows

#### 1. User Authentication Flow
```
User Registration/Login → JWT Token Storage → Protected Route Access → Token Refresh
```

#### 2. Learning Session Flow
```
Select Book → Start Session → Answer Questions → Submit Answers → View Results → Update Progress
```

#### 3. Progress Tracking Flow
```
Fetch User Data → Display Statistics → Update Charts → Track Achievements
```

## 🔌 API Integration

### Base Configuration
- **Base URL**: `https://api.lexik3.com/v1` (Production)
- **Development URL**: `https://localhost:7001` (Local)
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer Token

### API Client Setup
```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.lexik3.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 📊 Data Models & Types

### Core TypeScript Interfaces

```typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

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

// types/auth.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastLoginAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  dailyGoal: number;
  notifications: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

// types/books.ts
export interface Book {
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

export interface UserBookProgress {
  isEnrolled: boolean;
  wordsLearned: number;
  currentStreak: number;
  lastStudied: string;
}

// types/words.ts
export interface Word {
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

export interface WordProgress {
  masteryLevel: number;
  nextReview: string;
  timesReviewed: number;
  lastCorrect: boolean;
}

// types/learning.ts
export interface LearningSession {
  sessionId: string;
  bookId: string;
  day: number;
  sessionType: SessionType;
  startedAt: string;
  totalWords: number;
  words: SessionWord[];
}

export interface SessionWord {
  id: string;
  term: string;
  definition: string;
  isNew: boolean;
}

export interface SessionAnswer {
  wordId: string;
  answer: string;
  responseTime: number;
  confidence: number;
}

export interface SessionResult {
  wordId: string;
  isCorrect: boolean;
  score: number;
  masteryLevel: number;
  nextReview: string;
  feedback: string;
}

// types/progress.ts
export interface UserProgress {
  overall: OverallProgress;
  byBook: BookProgress[];
  recentActivity: DailyActivity[];
  achievements: Achievement[];
}

export interface OverallProgress {
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: string;
  accuracy: number;
  level: string;
}

export interface BookProgress {
  bookId: string;
  bookTitle: string;
  wordsLearned: number;
  totalWords: number;
  progress: number;
  currentStreak: number;
  lastStudied: string;
}

export interface DailyActivity {
  date: string;
  wordsStudied: number;
  accuracy: number;
  studyTime: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
}

// Enums
export enum DifficultyLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}

export enum PartOfSpeech {
  Noun = 'noun',
  Verb = 'verb',
  Adjective = 'adjective',
  Adverb = 'adverb',
  Preposition = 'preposition',
  Conjunction = 'conjunction',
  Interjection = 'interjection'
}

export enum SessionType {
  Daily = 'daily',
  Review = 'review',
  Custom = 'custom'
}
```

## 🔐 Authentication Flow

### JWT Token Management

```typescript
// services/auth/authService.ts
export class AuthService {
  private static readonly TOKEN_KEY = 'jwt_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_KEY = 'user_data';

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', {
      email,
      password
    });
    
    const { data } = response.data;
    this.storeTokens(data);
    return data;
  }

  static async register(userData: RegisterRequest): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>('/api/auth/register', userData);
    return response.data.data;
  }

  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/refresh', {
      refreshToken
    });
    
    const { data } = response.data;
    this.storeTokens(data);
    return data;
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  private static storeTokens(authData: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authData.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
  }

  private static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
```

### Protected Route Component

```typescript
// components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService } from '../../services/auth/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

## 🗃️ State Management

### Redux Toolkit Setup

```typescript
// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '../../services/auth/authService';
import { User, AuthResponse } from '../../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: AuthService.getUser(),
  token: AuthService.getToken(),
  isAuthenticated: AuthService.isAuthenticated(),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await AuthService.login(email, password);
    return response;
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await AuthService.logout();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
```

### Learning Session State

```typescript
// store/slices/learningSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LearningService } from '../../services/learning/learningService';
import { LearningSession, SessionAnswer, SessionResult } from '../../types/learning';

interface LearningState {
  currentSession: LearningSession | null;
  currentWordIndex: number;
  answers: SessionAnswer[];
  results: SessionResult[];
  loading: boolean;
  error: string | null;
}

const initialState: LearningState = {
  currentSession: null,
  currentWordIndex: 0,
  answers: [],
  results: [],
  loading: false,
  error: null,
};

export const startSession = createAsyncThunk(
  'learning/startSession',
  async ({ bookId, day, sessionType }: { bookId: string; day: number; sessionType: string }) => {
    const response = await LearningService.startSession(bookId, day, sessionType);
    return response;
  }
);

export const submitAnswer = createAsyncThunk(
  'learning/submitAnswer',
  async ({ sessionId, answer }: { sessionId: string; answer: SessionAnswer }) => {
    const response = await LearningService.submitAnswer(sessionId, answer);
    return response;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSession.fulfilled, (state, action: PayloadAction<LearningSession>) => {
        state.currentSession = action.payload;
        state.currentWordIndex = 0;
        state.answers = [];
        state.results = [];
      })
      .addCase(submitAnswer.fulfilled, (state, action: PayloadAction<SessionResult>) => {
        state.results.push(action.payload);
      });
  },
});

export const { nextWord, previousWord, addAnswer, clearSession } = learningSlice.actions;
export default learningSlice.reducer;
```

## 🎨 UI/UX Requirements

### Design System

#### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-50: #f0f9ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* Success Colors */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  
  /* Warning Colors */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  
  /* Error Colors */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  
  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-500: #6b7280;
  --gray-900: #111827;
}
```

#### Typography
```css
/* Headings */
.heading-1 { font-size: 2.25rem; font-weight: 700; line-height: 1.2; }
.heading-2 { font-size: 1.875rem; font-weight: 600; line-height: 1.3; }
.heading-3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }

/* Body Text */
.body-large { font-size: 1.125rem; font-weight: 400; line-height: 1.6; }
.body-medium { font-size: 1rem; font-weight: 400; line-height: 1.5; }
.body-small { font-size: 0.875rem; font-weight: 400; line-height: 1.4; }
```

### Component Requirements

#### 1. Learning Session Components
- **WordCard**: Display word with definition, examples, and pronunciation
- **AnswerInput**: Text input for user answers with validation
- **ProgressBar**: Show session progress and completion percentage
- **Timer**: Optional timer for response tracking
- **FeedbackCard**: Show correct/incorrect feedback with explanations

#### 2. Progress Tracking Components
- **StatsCard**: Display key statistics (streak, words learned, accuracy)
- **ProgressChart**: Visual representation of learning progress
- **AchievementBadge**: Display unlocked achievements
- **StreakCounter**: Animated streak counter with fire emoji

#### 3. Book Management Components
- **BookCard**: Display book information with enrollment status
- **BookList**: Grid/list view of available books
- **BookFilter**: Filter books by language, difficulty, category
- **EnrollmentButton**: Enroll/unenroll from books

### Responsive Design Requirements

#### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

#### Mobile Optimizations
- Touch-friendly button sizes (min 44px)
- Swipe gestures for navigation
- Optimized keyboard handling
- Offline capability for learning sessions

## 🚀 Setup & Development

### Prerequisites
- Node.js 18+ and npm/yarn
- Git
- Code editor (VS Code recommended)
- Backend API running locally or deployed

### Project Setup

```bash
# 1. Create React app with TypeScript
npx create-react-app lexik3-frontend --template typescript
cd lexik3-frontend

# 2. Install dependencies
npm install @reduxjs/toolkit react-redux
npm install axios react-router-dom
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install recharts  # for charts
npm install react-hook-form  # for forms
npm install @hookform/resolvers yup  # for validation

# 3. Install dev dependencies
npm install -D @types/node
npm install -D eslint @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D cypress  # for e2e testing
```

### Environment Configuration

```bash
# .env.development
REACT_APP_API_URL=https://localhost:7001
REACT_APP_APP_NAME=LexiK3
REACT_APP_VERSION=1.0.0

# .env.production
REACT_APP_API_URL=https://api.lexik3.com/v1
REACT_APP_APP_NAME=LexiK3
REACT_APP_VERSION=1.0.0
```

### Development Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,css,md}",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run"
  }
}
```

## 📋 Development Guidelines

### Code Standards
- Use TypeScript for all components and utilities
- Follow React functional component patterns with hooks
- Implement proper error boundaries
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Write comprehensive JSDoc comments for complex functions

### Testing Strategy
- Unit tests for all utility functions and hooks
- Component tests for UI components
- Integration tests for API services
- E2E tests for critical user flows

### Performance Guidelines
- Implement code splitting for route-based chunks
- Use React.memo for expensive components
- Optimize images and assets
- Implement proper loading states
- Use virtual scrolling for large lists

### Security Considerations
- Never store sensitive data in localStorage
- Implement proper input sanitization
- Use HTTPS in production
- Implement proper error handling to avoid information leakage
- Validate all user inputs on the client side

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Ready for Development ✅
