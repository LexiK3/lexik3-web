// pages/__tests__/Progress.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Progress from '../Progress';
import progressReducer from '../../store/slices/progressSlice';
import authReducer from '../../store/slices/authSlice';

// Mock the progress service
jest.mock('../../services/progress/progressService', () => ({
  ProgressService: {
    getStatistics: jest.fn(),
    getAchievements: jest.fn(),
    getDailyProgress: jest.fn(),
  },
}));

// Mock the thunks to return empty actions
jest.mock('../../store/slices/progressSlice', () => {
  const actual = jest.requireActual('../../store/slices/progressSlice');
  return {
    ...actual,
    fetchStatistics: jest.fn(),
    fetchAchievements: jest.fn(),
    fetchDailyProgress: jest.fn(),
    clearError: jest.fn(),
  };
});

// Mock the common components
jest.mock('../../components/common/Card', () => {
  return function MockCard({ children, className }: any) {
    return <div className={className} data-testid="card">{children}</div>;
  };
});

jest.mock('../../components/common/Button', () => {
  return function MockButton({ children, onClick, variant, size, ...props }: any) {
    return (
      <button 
        onClick={onClick} 
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </button>
    );
  };
});

jest.mock('../../components/common/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

jest.mock('../../components/common/LoadingCard', () => {
  return function MockLoadingCard({ lines, className }: any) {
    return <div className={className} data-testid="loading-card" data-lines={lines}>Loading...</div>;
  };
});

jest.mock('../../components/common/ErrorMessage', () => {
  return function MockErrorMessage({ error, onRetry, onDismiss, className }: any) {
    return (
      <div className={className} data-testid="error-message">
        <div>Error: {error}</div>
        <button onClick={onRetry}>Retry</button>
        <button onClick={onDismiss}>Dismiss</button>
      </div>
    );
  };
});

const mockStatistics = {
  studyTime: {
    total: 120,
    averagePerDay: 15,
    averagePerSession: 20,
    byDayOfWeek: {},
    byHourOfDay: {},
    longestSession: 45,
    totalSessions: 6,
  },
  accuracy: {
    overall: 0.85,
    byDifficulty: {},
    byPartOfSpeech: {},
    trend: 'improving' as any,
    bestDay: '2024-01-15',
    worstDay: '2024-01-10',
    averageImprovement: 0.05,
  },
  words: {
    totalLearned: 150,
    newThisWeek: 25,
    reviewedThisWeek: 50,
    mastered: 100,
    inProgress: 50,
    masteryDistribution: {},
    averageTimeToMaster: 7,
    retentionRate: 0.9,
  },
  streaks: {
    current: 5,
    longest: 15,
    average: 8,
    total: 3,
    bestMonth: 'January',
    consistency: 0.8,
  },
  sessions: {
    total: 20,
    averagePerDay: 2,
    averageDuration: 25,
    completionRate: 0.95,
    bestSession: {},
    averageScore: 85,
    improvementRate: 0.1,
  },
  trends: {
    weeklyGrowth: 15,
    monthlyGrowth: 25,
    accuracyTrend: 0.02,
    timeTrend: 5,
    wordTrend: 10,
    streakTrend: 2,
  },
};

const mockAchievements = [
  {
    id: 'achievement-1',
    name: 'First Steps',
    description: 'Complete your first learning session',
    type: 'session' as any,
    category: 'learning',
    icon: '🎯',
    points: 10,
    rarity: 'common' as any,
    requirements: [],
    isUnlocked: true,
    unlockedAt: '2024-01-01T10:00:00Z',
    progress: 1,
    isSecret: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'achievement-2',
    name: 'Word Master',
    description: 'Learn 100 words',
    type: 'words' as any,
    category: 'learning',
    icon: '📚',
    points: 50,
    rarity: 'rare' as any,
    requirements: [],
    isUnlocked: false,
    progress: 0.3,
    isSecret: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const mockDailyProgress = [
  {
    date: '2024-01-01',
    wordsStudied: 10,
    accuracy: 0.8,
    studyTime: 15,
    sessionsCompleted: 1,
    newWordsLearned: 5,
    wordsReviewed: 5,
    streakMaintained: true,
    achievementsUnlocked: 0,
    booksStudied: ['book-1'],
  },
  {
    date: '2024-01-02',
    wordsStudied: 15,
    accuracy: 0.9,
    studyTime: 20,
    sessionsCompleted: 2,
    newWordsLearned: 8,
    wordsReviewed: 7,
    streakMaintained: true,
    achievementsUnlocked: 1,
    booksStudied: ['book-1'],
  },
];

const createMockStore = (initialState: any = {}) => {
  const store = configureStore({
    reducer: {
      progress: progressReducer,
      auth: authReducer,
    },
    preloadedState: {
      progress: {
        userProgress: null,
        dailyProgress: [],
        statistics: null,
        achievements: [],
        isLoading: false,
        error: null,
        lastUpdated: null,
        selectedPeriod: 'week',
        selectedBook: undefined,
        ...(initialState.progress || {}),
      },
      auth: {
        user: { id: 'user-1', email: 'test@example.com' },
        token: 'token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        ...(initialState.auth || {}),
      },
    },
  });
  return store;
};

describe('Progress Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render progress page with header', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });

  it('should display loading state when data is loading', () => {
    const store = createMockStore({
      progress: { isLoading: true },
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    expect(screen.getAllByTestId('loading-card')).toHaveLength(2);
  });

  it('should display error message when there is an error', () => {
    const store = createMockStore({
      progress: { 
        error: 'Failed to load progress data',
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Error: Failed to load progress data')).toBeInTheDocument();
  });

  it('should handle retry when error occurs', async () => {
    const store = createMockStore({
      progress: { 
        error: 'Failed to load progress data',
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    // The retry should dispatch the fetch actions
    await waitFor(() => {
      expect(store.getState().progress.error).toBeNull();
    });
  });

  it('should display statistics when available', () => {
    const store = createMockStore({
      progress: { 
        statistics: mockStatistics,
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument(); // Total study time
    expect(screen.getByText('Total Study Time (min)')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument(); // Overall accuracy
    expect(screen.getByText('Overall Accuracy')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument(); // Words learned
    expect(screen.getByText('Words Learned')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Current streak
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
  });

  it('should display achievements when available', () => {
    const store = createMockStore({
      progress: { 
        achievements: mockAchievements,
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('First Steps')).toBeInTheDocument();
    expect(screen.getByText('Complete your first learning session')).toBeInTheDocument();
    expect(screen.getByText('Word Master')).toBeInTheDocument();
    expect(screen.getByText('Learn 100 words')).toBeInTheDocument();
  });

  it('should display no statistics message when statistics are null', () => {
    const store = createMockStore({
      progress: { 
        statistics: null,
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    expect(screen.getByText('No statistics available')).toBeInTheDocument();
    expect(screen.getByText('Start learning to see your progress statistics here.')).toBeInTheDocument();
    expect(screen.getByText('Start Learning')).toBeInTheDocument();
  });

  it('should display no achievements message when achievements are empty', () => {
    const store = createMockStore({
      progress: { 
        achievements: [],
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    expect(screen.getByText('No achievements yet')).toBeInTheDocument();
    expect(screen.getByText('Complete learning sessions to unlock achievements.')).toBeInTheDocument();
  });

  it('should limit achievements display to 5 items', () => {
    const manyAchievements = Array.from({ length: 7 }, (_, i) => ({
      ...mockAchievements[0],
      id: `achievement-${i}`,
      name: `Achievement ${i + 1}`,
    }));

    const store = createMockStore({
      progress: { 
        achievements: manyAchievements,
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    // Should show first 5 achievements
    expect(screen.getByText('Achievement 1')).toBeInTheDocument();
    expect(screen.getByText('Achievement 5')).toBeInTheDocument();
    expect(screen.queryByText('Achievement 6')).not.toBeInTheDocument();
    expect(screen.queryByText('Achievement 7')).not.toBeInTheDocument();
    
    // Should show "View All Achievements" button
    expect(screen.getByText('View All Achievements')).toBeInTheDocument();
  });

  it('should not show "View All Achievements" button when achievements are 5 or fewer', () => {
    const store = createMockStore({
      progress: { 
        achievements: mockAchievements,
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    expect(screen.queryByText('View All Achievements')).not.toBeInTheDocument();
  });

  it('should handle back button click', () => {
    const store = createMockStore();
    
    // Mock window.history.back
    const mockBack = jest.fn();
    Object.defineProperty(window, 'history', {
      value: { back: mockBack },
      writable: true,
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    const backButton = screen.getByText('Back to Dashboard');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should handle start learning button click in no statistics state', () => {
    const store = createMockStore({
      progress: { 
        statistics: null,
        isLoading: false,
      },
    });

    // Mock window.location.href
    delete (window as any).location;
    (window as any).location = { href: '' };

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    const startLearningButton = screen.getByText('Start Learning');
    fireEvent.click(startLearningButton);

    expect(window.location.href).toBe('/learning');
  });

  it('should handle start learning button click in no achievements state', () => {
    const store = createMockStore({
      progress: { 
        achievements: [],
        isLoading: false,
      },
    });

    // Mock window.location.href
    delete (window as any).location;
    (window as any).location = { href: '' };

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    const startLearningButton = screen.getByText('Start Learning');
    fireEvent.click(startLearningButton);

    expect(window.location.href).toBe('/learning');
  });

  it('should display statistics in correct grid layout', () => {
    const store = createMockStore({
      progress: { 
        statistics: mockStatistics,
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    // Check that statistics are displayed in a grid layout
    const statisticsSection = screen.getByText('Statistics').closest('[data-testid="card"]');
    expect(statisticsSection).toBeInTheDocument();
  });

  it('should display achievements in correct grid layout', () => {
    const store = createMockStore({
      progress: { 
        achievements: mockAchievements,
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Progress />
      </Provider>
    );

    // Check that achievements are displayed in a grid layout
    const achievementsSection = screen.getByText('Achievements').closest('[data-testid="card"]');
    expect(achievementsSection).toBeInTheDocument();
  });
});
