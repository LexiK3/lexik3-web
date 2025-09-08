// store/slices/progressSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProgress, DailyActivity, LearningStatistics, Achievement } from '../../types/progress';
import { ProgressState } from '../../types/store';

const initialState: ProgressState = {
  userProgress: null,
  dailyProgress: [],
  statistics: null,
  achievements: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  selectedPeriod: 'week',
  selectedBook: undefined,
};

// Mock async thunks for now - will be replaced with actual API calls
export const fetchUserProgress = createAsyncThunk(
  'progress/fetchUserProgress',
  async (params: { period?: 'week' | 'month' | 'year' | 'all'; bookId?: string } = {}, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      const mockProgress: UserProgress = {
        userId: 'user-1',
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
        achievements: [],
        statistics: {} as LearningStatistics,
        lastUpdated: new Date().toISOString(),
      };
      return mockProgress;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch progress');
    }
  }
);

export const fetchDailyProgress = createAsyncThunk(
  'progress/fetchDailyProgress',
  async (params: { startDate?: string; endDate?: string; bookId?: string } = {}, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      const mockDailyProgress: DailyActivity[] = [
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
          booksStudied: ['book-1'],
        },
      ];
      return mockDailyProgress;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch daily progress');
    }
  }
);

export const fetchStatistics = createAsyncThunk(
  'progress/fetchStatistics',
  async (params: { period?: 'week' | 'month' | 'year' | 'all'; bookId?: string } = {}, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      const mockStatistics: LearningStatistics = {
        studyTime: {
          total: 1200,
          averagePerDay: 30,
          averagePerSession: 15,
          byDayOfWeek: {},
          byHourOfDay: {},
          longestSession: 45,
          totalSessions: 40,
        },
        accuracy: {
          overall: 0.85,
          byDifficulty: {} as any,
          byPartOfSpeech: {} as any,
          trend: 'improving',
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
          current: 7,
          longest: 15,
          average: 5,
          total: 30,
          bestMonth: '2024-01',
          consistency: 0.8,
        },
        sessions: {
          total: 40,
          averagePerDay: 2,
          averageDuration: 15,
          completionRate: 0.95,
          bestSession: {} as any,
          averageScore: 85,
          improvementRate: 0.1,
        },
        trends: {
          weeklyGrowth: 15,
          monthlyGrowth: 25,
          accuracyTrend: 0.02,
          timeTrend: 0.05,
          wordTrend: 0.1,
          streakTrend: 0.03,
        },
      };
      return mockStatistics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch statistics');
    }
  }
);

export const fetchAchievements = createAsyncThunk(
  'progress/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      const mockAchievements: Achievement[] = [
        {
          id: 'achievement-1',
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
      ];
      return mockAchievements;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch achievements');
    }
  }
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setSelectedPeriod: (state, action: PayloadAction<'week' | 'month' | 'year' | 'all'>) => {
      state.selectedPeriod = action.payload;
    },
    setSelectedBook: (state, action: PayloadAction<string | undefined>) => {
      state.selectedBook = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch User Progress
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action: PayloadAction<UserProgress>) => {
        state.isLoading = false;
        state.userProgress = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Daily Progress
    builder
      .addCase(fetchDailyProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDailyProgress.fulfilled, (state, action: PayloadAction<DailyActivity[]>) => {
        state.isLoading = false;
        state.dailyProgress = action.payload;
      })
      .addCase(fetchDailyProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Statistics
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action: PayloadAction<LearningStatistics>) => {
        state.isLoading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Achievements
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action: PayloadAction<Achievement[]>) => {
        state.isLoading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedPeriod, setSelectedBook, clearError } = progressSlice.actions;

export default progressSlice.reducer;
