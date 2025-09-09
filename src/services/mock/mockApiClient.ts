// services/mock/mockApiClient.ts
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth';
import { Book, LearningSession, SessionAnswer, SessionResult } from '../../types/learning';
import { UserProgress, DailyActivity, LearningStatistics, Achievement } from '../../types/progress';
import { ApiResponse, ApiError } from '../../types/common';

// Mock data storage
class MockDataStore {
  private static instance: MockDataStore;
  private users: User[] = [];
  private books: Book[] = [];
  private sessions: LearningSession[] = [];
  private achievements: Achievement[] = [];
  private userProgress: Map<string, UserProgress> = new Map();

  static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore();
    }
    return MockDataStore.instance;
  }

  // Initialize with default mock data
  initializeMockData() {
    this.users = [
      {
        id: '1',
        email: 'demo@lexik3.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'student' as any,
        isEmailVerified: true,
        preferences: {
          language: 'en' as any,
          theme: 'light' as any,
          dailyGoal: 20,
          notifications: {
            email: true,
            push: true,
            achievements: true,
            reminders: true,
            progress: true,
            social: false,
          },
          privacy: {
            profileVisibility: 'public' as any,
            showProgress: true,
            showAchievements: true,
            allowFriendRequests: true,
          },
          learning: {
            sessionDuration: 15,
            wordsPerSession: 10,
            difficultyPreference: 'intermediate',
            autoAdvance: true,
            showHints: true,
            soundEnabled: true,
          },
        },
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        email: 'test@lexik3.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'student' as any,
        isEmailVerified: false,
        preferences: {
          language: 'es' as any,
          theme: 'dark' as any,
          dailyGoal: 15,
          notifications: {
            email: false,
            push: true,
            achievements: true,
            reminders: false,
            progress: true,
            social: true,
          },
          privacy: {
            profileVisibility: 'private' as any,
            showProgress: false,
            showAchievements: true,
            allowFriendRequests: false,
          },
          learning: {
            sessionDuration: 20,
            wordsPerSession: 15,
            difficultyPreference: 'advanced',
            autoAdvance: false,
            showHints: false,
            soundEnabled: false,
          },
        },
        createdAt: '2024-01-02T00:00:00Z',
      },
    ];

    this.books = [
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
      {
        id: '2',
        title: 'Business English Essentials',
        description: 'Professional vocabulary for workplace communication',
        language: 'en' as any,
        totalWords: 300,
        difficulty: 'Intermediate' as any,
        createdAt: '2024-01-01T00:00:00Z',
        isPublic: true,
        author: 'LexiK3 Team',
        categories: ['business', 'intermediate'],
        estimatedTime: '3 weeks',
        tags: ['english', 'business', 'intermediate'],
        userProgress: {
          isEnrolled: false,
          wordsLearned: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastStudied: undefined,
          progressPercentage: 0,
          averageAccuracy: 0,
          totalStudyTime: 0,
          isCompleted: false,
        },
      },
      {
        id: '3',
        title: 'Spanish for Beginners',
        description: 'Learn basic Spanish vocabulary and phrases',
        language: 'es' as any,
        totalWords: 400,
        difficulty: 'Beginner' as any,
        createdAt: '2024-01-01T00:00:00Z',
        isPublic: true,
        author: 'LexiK3 Team',
        categories: ['general', 'beginner'],
        estimatedTime: '2.5 weeks',
        tags: ['spanish', 'beginner'],
        userProgress: {
          isEnrolled: true,
          wordsLearned: 80,
          currentStreak: 3,
          longestStreak: 8,
          lastStudied: '2024-01-14T15:45:00Z',
          progressPercentage: 20,
          averageAccuracy: 0.78,
          totalStudyTime: 60,
          isCompleted: false,
        },
      },
    ];

    this.achievements = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first learning session',
        type: 'learning' as any,
        category: 'milestone',
        icon: '🎯',
        points: 10,
        rarity: 'common',
        requirements: [],
        isUnlocked: true,
        unlockedAt: '2024-01-01T00:00:00Z',
        progress: 1,
        isSecret: false,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Word Master',
        description: 'Learn 100 words',
        type: 'learning' as any,
        category: 'milestone',
        icon: '📚',
        points: 50,
        rarity: 'uncommon',
        requirements: [],
        isUnlocked: false,
        progress: 0.6,
        isSecret: false,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '3',
        name: 'Streak Keeper',
        description: 'Maintain a 7-day learning streak',
        type: 'consistency' as any,
        category: 'milestone',
        icon: '🔥',
        points: 25,
        rarity: 'rare',
        requirements: [],
        isUnlocked: true,
        unlockedAt: '2024-01-15T00:00:00Z',
        progress: 1,
        isSecret: false,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ];

    // Initialize user progress
    this.userProgress.set('1', {
      userId: '1',
      overall: {
        totalWordsLearned: 150,
        currentStreak: 7,
        longestStreak: 15,
        totalStudyTime: 1200,
        accuracy: 0.85,
        level: 'Intermediate',
        experience: 2500,
        rank: 42,
        percentile: 75,
      },
      byBook: [
        {
          bookId: '1',
          bookTitle: 'Essential English Vocabulary',
          wordsLearned: 150,
          totalWords: 500,
          progress: 30,
          currentStreak: 7,
          lastStudied: '2024-01-15T10:30:00Z',
          isCompleted: false,
          averageAccuracy: 0.85,
          totalStudyTime: 120,
        },
        {
          bookId: '3',
          bookTitle: 'Spanish for Beginners',
          wordsLearned: 80,
          totalWords: 400,
          progress: 20,
          currentStreak: 3,
          lastStudied: '2024-01-14T15:45:00Z',
          isCompleted: false,
          averageAccuracy: 0.78,
          totalStudyTime: 60,
        },
      ],
      recentActivity: [
        {
          date: '2024-01-15',
          wordsStudied: 20,
          accuracy: 0.85,
          studyTime: 30,
          sessionsCompleted: 2,
          newWordsLearned: 5,
          wordsReviewed: 15,
          streakMaintained: true,
          achievementsUnlocked: 1,
          booksStudied: ['1'],
        },
        {
          date: '2024-01-14',
          wordsStudied: 15,
          accuracy: 0.80,
          studyTime: 25,
          sessionsCompleted: 1,
          newWordsLearned: 3,
          wordsReviewed: 12,
          streakMaintained: true,
          achievementsUnlocked: 0,
          booksStudied: ['1', '3'],
        },
      ],
      achievements: this.achievements,
      statistics: {} as LearningStatistics,
      lastUpdated: new Date().toISOString(),
    });
  }

  // Getters
  getUsers(): User[] { return this.users; }
  getBooks(): Book[] { return this.books; }
  getSessions(): LearningSession[] { return this.sessions; }
  getAchievements(): Achievement[] { return this.achievements; }
  getUserProgress(userId: string): UserProgress | undefined { return this.userProgress.get(userId); }

  // Setters
  addUser(user: User): void { this.users.push(user); }
  updateUser(userId: string, updates: Partial<User>): void {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
    }
  }
  updateBook(bookId: string, updates: Partial<Book>): void {
    const bookIndex = this.books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
      this.books[bookIndex] = { ...this.books[bookIndex], ...updates };
    }
  }
  addSession(session: LearningSession): void { this.sessions.push(session); }
  updateSession(sessionId: string, updates: Partial<LearningSession>): void {
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
      this.sessions[sessionIndex] = { ...this.sessions[sessionIndex], ...updates };
    }
  }
  updateUserProgress(userId: string, progress: UserProgress): void {
    this.userProgress.set(userId, progress);
  }
}

// Mock API Client that completely replaces axios
export class MockApiClient {
  private dataStore: MockDataStore;
  private baseURL: string;

  constructor(baseURL: string = 'https://api.lexik3.com/v1') {
    this.dataStore = MockDataStore.getInstance();
    this.baseURL = baseURL;
    this.dataStore.initializeMockData();
  }

  // Simulate network delay
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Create a mock response
  private createResponse<T>(data: T, status: number = 200): AxiosResponse<T> {
    return {
      data,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      headers: {},
      config: {} as any,
    };
  }

  // Create a mock error
  private createError(message: string, status: number = 400): Error {
    const error = new Error(message) as any;
    error.response = {
      data: {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message,
        },
        timestamp: new Date().toISOString(),
      },
      status,
    };
    return error;
  }

  // Mock HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    await this.delay(300 + Math.random() * 200); // 300-500ms delay

    try {
      const response = await this.handleGetRequest(url, config);
      return this.createResponse<T>(response as T);
    } catch (error) {
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    await this.delay(500 + Math.random() * 300); // 500-800ms delay

    try {
      const response = await this.handlePostRequest(url, data, config);
      return this.createResponse<T>(response as T);
    } catch (error) {
      throw error;
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    await this.delay(400 + Math.random() * 200); // 400-600ms delay

    try {
      const response = await this.handlePutRequest(url, data, config);
      return this.createResponse<T>(response as T);
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    await this.delay(300 + Math.random() * 200); // 300-500ms delay

    try {
      const response = await this.handleDeleteRequest(url, config);
      return this.createResponse<T>(response as T);
    } catch (error) {
      throw error;
    }
  }

  // Request handlers
  private async handleGetRequest(url: string, config?: AxiosRequestConfig): Promise<any> {
    // Authentication endpoints
    if (url.includes('/api/auth/profile')) {
      const token = this.getTokenFromHeaders(config?.headers);
      if (!token) {
        throw this.createError('Unauthorized', 401);
      }
      const user = this.dataStore.getUsers().find(u => u.id === '1');
      return {
        success: true,
        data: user,
        message: 'Profile retrieved successfully',
        timestamp: new Date().toISOString(),
      };
    }

    // Books endpoints
    if (url.includes('/api/books')) {
      const books = this.dataStore.getBooks();
      const page = this.getQueryParam(url, 'page') || '1';
      const pageSize = this.getQueryParam(url, 'pageSize') || '10';
      const language = this.getQueryParam(url, 'language');
      const search = this.getQueryParam(url, 'search');

      // Ensure books is always an array
      const booksArray = Array.isArray(books) ? books : [];
      let filteredBooks = booksArray;
      if (language) {
        filteredBooks = filteredBooks.filter(book => book.language === language);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(searchLower) ||
          book.description.toLowerCase().includes(searchLower)
        );
      }

      const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
      const endIndex = startIndex + parseInt(pageSize);
      const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          books: paginatedBooks,
          pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalItems: filteredBooks.length,
            totalPages: Math.ceil(filteredBooks.length / parseInt(pageSize)),
            hasNext: endIndex < filteredBooks.length,
            hasPrevious: parseInt(page) > 1,
          },
        },
        message: 'Books retrieved successfully',
        timestamp: new Date().toISOString(),
      };
    }

    // Progress endpoints
    if (url.includes('/api/progress')) {
      const userId = '1'; // Mock user ID
      const progress = this.dataStore.getUserProgress(userId);
      if (!progress) {
        throw this.createError('Progress not found', 404);
      }
      return {
        success: true,
        data: progress,
        message: 'Progress retrieved successfully',
        timestamp: new Date().toISOString(),
      };
    }

    // Achievements endpoints
    if (url.includes('/api/achievements')) {
      const achievements = this.dataStore.getAchievements();
      return {
        success: true,
        data: achievements,
        message: 'Achievements retrieved successfully',
        timestamp: new Date().toISOString(),
      };
    }

    // Default response
    return {
      success: true,
      data: { message: 'Mock endpoint not implemented' },
      message: 'Request processed',
      timestamp: new Date().toISOString(),
    };
  }

  private async handlePostRequest(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    // Authentication endpoints
    if (url.includes('/api/auth/login')) {
      return this.handleLogin(data);
    }

    if (url.includes('/api/auth/register')) {
      return this.handleRegister(data);
    }

    if (url.includes('/api/auth/refresh')) {
      return this.handleRefreshToken(data);
    }

    if (url.includes('/api/auth/logout')) {
      return this.handleLogout();
    }

    // Books endpoints
    if (url.includes('/api/books/') && url.includes('/enroll')) {
      const bookId = this.extractIdFromUrl(url, '/api/books/', '/enroll');
      return this.handleEnrollInBook(bookId);
    }

    // Learning endpoints
    if (url.includes('/api/learning-sessions')) {
      return this.handleStartSession(data);
    }

    if (url.includes('/api/learning-sessions/') && url.includes('/answers')) {
      const sessionId = this.extractIdFromUrl(url, '/api/learning-sessions/', '/answers');
      return this.handleSubmitAnswer(sessionId, data);
    }

    if (url.includes('/api/learning-sessions/') && url.includes('/complete')) {
      const sessionId = this.extractIdFromUrl(url, '/api/learning-sessions/', '/complete');
      return this.handleCompleteSession(sessionId);
    }

    // Default response
    return {
      success: true,
      data: { message: 'Mock POST endpoint not implemented' },
      message: 'Request processed',
      timestamp: new Date().toISOString(),
    };
  }

  private async handlePutRequest(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    // User profile update
    if (url.includes('/api/users/profile')) {
      const token = this.getTokenFromHeaders(config?.headers);
      if (!token) {
        throw this.createError('Unauthorized', 401);
      }
      
      this.dataStore.updateUser('1', data);
      const updatedUser = this.dataStore.getUsers().find(u => u.id === '1');
      
      return {
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: { message: 'Mock PUT endpoint not implemented' },
      message: 'Request processed',
      timestamp: new Date().toISOString(),
    };
  }

  private async handleDeleteRequest(url: string, config?: AxiosRequestConfig): Promise<any> {
    // Books unenroll
    if (url.includes('/api/books/') && url.includes('/enroll')) {
      const bookId = this.extractIdFromUrl(url, '/api/books/', '/enroll');
      return this.handleUnenrollFromBook(bookId);
    }

    return {
      success: true,
      data: { message: 'Mock DELETE endpoint not implemented' },
      message: 'Request processed',
      timestamp: new Date().toISOString(),
    };
  }

  // Specific endpoint handlers
  private async handleLogin(data: LoginRequest): Promise<any> {
    const user = this.dataStore.getUsers().find(u => u.email === data.email);
    
    if (!user || data.password !== 'password123') {
      throw this.createError('Invalid credentials', 401);
    }

    const authResponse: AuthResponse = {
      token: 'mock-jwt-token-' + user.id,
      refreshToken: 'mock-refresh-token-' + user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user,
    };

    return {
      success: true,
      data: authResponse,
      message: 'Login successful',
      timestamp: new Date().toISOString(),
    };
  }

  private async handleRegister(data: RegisterRequest): Promise<any> {
    if (this.dataStore.getUsers().find(u => u.email === data.email)) {
      throw this.createError('User already exists', 409);
    }

    if (data.password !== data.confirmPassword) {
      throw this.createError('Passwords do not match', 400);
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'student' as any,
      isEmailVerified: false,
      preferences: {
        language: 'en' as any,
        theme: 'light' as any,
        dailyGoal: 20,
        notifications: {
          email: true,
          push: true,
          achievements: true,
          reminders: true,
          progress: true,
          social: false,
        },
        privacy: {
          profileVisibility: 'public' as any,
          showProgress: true,
          showAchievements: true,
          allowFriendRequests: true,
        },
        learning: {
          sessionDuration: 15,
          wordsPerSession: 10,
          difficultyPreference: 'intermediate',
          autoAdvance: true,
          showHints: true,
          soundEnabled: true,
        },
      },
      createdAt: new Date().toISOString(),
    };

    this.dataStore.addUser(newUser);

    return {
      success: true,
      data: {
        userId: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        emailConfirmed: false,
      },
      message: 'Registration successful',
      timestamp: new Date().toISOString(),
    };
  }

  private async handleRefreshToken(data: { refreshToken: string }): Promise<any> {
    if (!data.refreshToken || !data.refreshToken.startsWith('mock-refresh-token-')) {
      throw this.createError('Invalid refresh token', 401);
    }

    const userId = data.refreshToken.replace('mock-refresh-token-', '');
    const user = this.dataStore.getUsers().find(u => u.id === userId);
    
    if (!user) {
      throw this.createError('User not found', 401);
    }

    const authResponse: AuthResponse = {
      token: 'mock-jwt-token-' + user.id,
      refreshToken: 'mock-refresh-token-' + user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user,
    };

    return {
      success: true,
      data: authResponse,
      message: 'Token refreshed successfully',
      timestamp: new Date().toISOString(),
    };
  }

  private async handleLogout(): Promise<any> {
    return {
      success: true,
      data: { message: 'Logged out successfully' },
      message: 'Logout successful',
      timestamp: new Date().toISOString(),
    };
  }

  private async handleEnrollInBook(bookId: string): Promise<any> {
    const book = this.dataStore.getBooks().find(b => b.id === bookId);
    if (!book) {
      throw this.createError('Book not found', 404);
    }

    if (book.userProgress?.isEnrolled) {
      throw this.createError('Already enrolled in this book', 400);
    }

    this.dataStore.updateBook(bookId, {
      userProgress: {
        isEnrolled: true,
        wordsLearned: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastStudied: undefined,
        progressPercentage: 0,
        averageAccuracy: 0,
        totalStudyTime: 0,
        isCompleted: false,
      },
    });

    return {
      success: true,
      data: { message: 'Successfully enrolled in book' },
      message: 'Enrollment successful',
      timestamp: new Date().toISOString(),
    };
  }

  private async handleUnenrollFromBook(bookId: string): Promise<any> {
    const book = this.dataStore.getBooks().find(b => b.id === bookId);
    if (!book) {
      throw this.createError('Book not found', 404);
    }

    this.dataStore.updateBook(bookId, {
      userProgress: {
        isEnrolled: false,
        wordsLearned: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastStudied: undefined,
        progressPercentage: 0,
        averageAccuracy: 0,
        totalStudyTime: 0,
        isCompleted: false,
      },
    });

    return {
      success: true,
      data: { message: 'Successfully unenrolled from book' },
      message: 'Unenrollment successful',
      timestamp: new Date().toISOString(),
    };
  }

  private async handleStartSession(data: { bookId: string; day: number; sessionType: string }): Promise<any> {
    const book = this.dataStore.getBooks().find(b => b.id === data.bookId);
    if (!book) {
      throw this.createError('Book not found', 404);
    }

    const session: LearningSession = {
      id: Date.now().toString(),
      userId: '1',
      bookId: data.bookId,
      sessionType: data.sessionType as any,
      startedAt: new Date().toISOString(),
      totalWords: 10,
      words: [], // Mock words would be generated here
      answers: [],
      results: [],
      statistics: {
        totalWords: 10,
        correctAnswers: 0,
        accuracy: 0,
        averageResponseTime: 0,
        totalTime: 0,
        newWords: 5,
        reviewWords: 5,
        hintsUsed: 0,
        score: 0,
        improvement: 0,
      },
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.dataStore.addSession(session);

    return {
      success: true,
      data: session,
      message: 'Session started successfully',
      timestamp: new Date().toISOString(),
    };
  }

  private async handleSubmitAnswer(sessionId: string, data: SessionAnswer): Promise<any> {
    const session = this.dataStore.getSessions().find(s => s.id === sessionId);
    if (!session) {
      throw this.createError('Session not found', 404);
    }

    // Mock answer processing
    const isCorrect = Math.random() > 0.3; // 70% chance of being correct
    const result: SessionResult = {
      wordId: data.wordId,
      isCorrect,
      score: isCorrect ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 30),
      masteryLevel: isCorrect ? Math.min(5, (session.statistics.correctAnswers + (isCorrect ? 1 : 0)) / 2) : 1,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      feedback: isCorrect ? 'Great job!' : 'Keep practicing!',
      timeSpent: data.responseTime || 0,
      hintsUsed: 0, // This would be tracked in the actual implementation
      attempts: 1, // This would be tracked in the actual implementation
      improvement: 0, // This would be calculated in the actual implementation
    };

    session.answers.push(data);
    session.results.push(result);
    session.statistics.correctAnswers += isCorrect ? 1 : 0;
    session.statistics.accuracy = session.statistics.correctAnswers / session.answers.length;

    this.dataStore.updateSession(sessionId, session);

    return {
      success: true,
      data: result,
      message: 'Answer submitted successfully',
      timestamp: new Date().toISOString(),
    };
  }

  private async handleCompleteSession(sessionId: string): Promise<any> {
    const session = this.dataStore.getSessions().find(s => s.id === sessionId);
    if (!session) {
      throw this.createError('Session not found', 404);
    }

    session.isActive = false;
    session.statistics.totalTime = Date.now() - new Date(session.startedAt).getTime();

    this.dataStore.updateSession(sessionId, session);

    return {
      success: true,
      data: {
        sessionId,
        completedAt: new Date().toISOString(),
        duration: session.statistics.totalTime,
        wordsStudied: session.answers.length,
        correctAnswers: session.statistics.correctAnswers,
        accuracy: session.statistics.accuracy,
        score: session.statistics.score,
        streakUpdated: true,
        achievements: [],
      },
      message: 'Session completed successfully',
      timestamp: new Date().toISOString(),
    };
  }

  // Utility methods
  private getTokenFromHeaders(headers?: any): string | null {
    if (!headers?.Authorization) return null;
    return headers.Authorization.replace('Bearer ', '');
  }

  private getQueryParam(url: string, param: string): string | null {
    const urlObj = new URL(url, 'http://localhost');
    return urlObj.searchParams.get(param);
  }

  private extractIdFromUrl(url: string, prefix: string, suffix: string): string {
    const start = url.indexOf(prefix) + prefix.length;
    const end = url.indexOf(suffix, start);
    return url.substring(start, end);
  }
}

// Create and export the mock client instance
export const mockApiClient = new MockApiClient();
