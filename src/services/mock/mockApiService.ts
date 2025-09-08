// services/mock/mockApiService.ts
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth';
import { Book, LearningSession, SessionAnswer, SessionResult } from '../../types/learning';
import { UserProgress, DailyActivity, LearningStatistics, Achievement } from '../../types/progress';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
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
  },
];

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
  },
];

const mockAchievements: Achievement[] = [
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
];

export class MockApiService {
  // Auth methods
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    await this.delay(1000);
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user || credentials.password !== 'password') {
      throw new Error('Invalid credentials');
    }

    return {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user,
    };
  }

  static async register(userData: RegisterRequest): Promise<User> {
    await this.delay(1000);
    
    if (mockUsers.find(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
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

    mockUsers.push(newUser);
    return newUser;
  }

  // Books methods
  static async getBooks(): Promise<Book[]> {
    await this.delay(500);
    return mockBooks;
  }

  static async getBookById(id: string): Promise<Book> {
    await this.delay(300);
    const book = mockBooks.find(b => b.id === id);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  // Learning methods
  static async startSession(bookId: string): Promise<LearningSession> {
    await this.delay(500);
    
    const book = mockBooks.find(b => b.id === bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const session: LearningSession = {
      id: Date.now().toString(),
      userId: '1',
      bookId,
      sessionType: 'daily' as any,
      startedAt: new Date().toISOString(),
      totalWords: 10,
      words: [], // Mock words would go here
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

    return session;
  }

  // Progress methods
  static async getUserProgress(): Promise<UserProgress> {
    await this.delay(500);
    
    return {
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
      byBook: [],
      recentActivity: [],
      achievements: mockAchievements,
      statistics: {} as LearningStatistics,
      lastUpdated: new Date().toISOString(),
    };
  }

  static async getDailyProgress(): Promise<DailyActivity[]> {
    await this.delay(300);
    
    return [
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
        booksStudied: ['1'],
      },
    ];
  }

  static async getAchievements(): Promise<Achievement[]> {
    await this.delay(300);
    return mockAchievements;
  }

  // Utility method
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
