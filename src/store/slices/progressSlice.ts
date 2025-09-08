// store/slices/progressSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserProgress, DailyActivity, LearningStatistics, Achievement, ProgressOverview, DailyProgress, Statistics } from '../../types/progress';
import { ProgressState } from '../../types/store';
import { ProgressService } from '../../services/progress/progressService';

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

// Async thunks using real API service
export const fetchUserProgress = createAsyncThunk(
  'progress/fetchUserProgress',
  async (params: { period?: 'week' | 'month' | 'year' | 'all'; bookId?: string } = {}, { rejectWithValue }) => {
    try {
      const progressOverview = await ProgressService.getProgressOverview();
      return progressOverview;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch progress');
    }
  }
);

export const fetchDailyProgress = createAsyncThunk(
  'progress/fetchDailyProgress',
  async (params: { startDate?: string; endDate?: string; bookId?: string; days?: number } = {}, { rejectWithValue }) => {
    try {
      let dailyProgress: DailyProgress[];
      
      if (params.startDate && params.endDate) {
        dailyProgress = await ProgressService.getProgressByDateRange(params.startDate, params.endDate);
      } else {
        dailyProgress = await ProgressService.getDailyProgress(params.days);
      }
      
      return dailyProgress;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch daily progress');
    }
  }
);

export const fetchStatistics = createAsyncThunk(
  'progress/fetchStatistics',
  async (params: { period?: 'week' | 'month' | 'year' | 'all'; bookId?: string } = {}, { rejectWithValue }) => {
    try {
      const statistics = await ProgressService.getStatistics();
      return statistics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch statistics');
    }
  }
);

export const fetchAchievements = createAsyncThunk(
  'progress/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      const achievements = await ProgressService.getAchievements();
      return achievements;
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
