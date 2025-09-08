// store/slices/learningSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LearningSession, SessionAnswer, SessionResult, StartSessionRequest } from '../../types/learning';
import { LearningState } from '../../types/store';

const initialState: LearningState = {
  currentSession: null,
  sessionHistory: [],
  currentWordIndex: 0,
  answers: [],
  results: [],
  isLoading: false,
  error: null,
  sessionStats: {
    totalSessions: 0,
    totalWordsStudied: 0,
    averageAccuracy: 0,
    currentStreak: 0,
    longestStreak: 0,
  },
  isPaused: false,
  pauseTime: undefined,
  hintsUsed: 0,
  totalHints: 0,
};

// Mock async thunks for now - will be replaced with actual API calls
export const startSession = createAsyncThunk(
  'learning/startSession',
  async (sessionData: StartSessionRequest, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      const mockSession: LearningSession = {
        id: 'session-1',
        userId: 'user-1',
        bookId: sessionData.bookId,
        day: sessionData.day,
        sessionType: sessionData.sessionType,
        startedAt: new Date().toISOString(),
        totalWords: 10,
        words: [],
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
      return mockSession;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start session');
    }
  }
);

export const submitAnswer = createAsyncThunk(
  'learning/submitAnswer',
  async ({ sessionId, answer }: { sessionId: string; answer: SessionAnswer }, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      const mockResult: SessionResult = {
        wordId: answer.wordId,
        isCorrect: Math.random() > 0.3, // Mock 70% accuracy
        score: Math.floor(Math.random() * 100),
        masteryLevel: Math.floor(Math.random() * 5) + 1,
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        feedback: 'Good job!',
        timeSpent: answer.responseTime,
        hintsUsed: answer.hintsUsed || 0,
        attempts: answer.attempts || 1,
        improvement: Math.floor(Math.random() * 20),
      };
      return mockResult;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit answer');
    }
  }
);

export const completeSession = createAsyncThunk(
  'learning/completeSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      // Mock implementation - replace with actual API call
      return {
        sessionId,
        completedAt: new Date().toISOString(),
        duration: '15 minutes',
        wordsStudied: 10,
        correctAnswers: 7,
        accuracy: 0.7,
        score: 85,
        streakUpdated: true,
        achievements: [],
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete session');
    }
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
      state.isPaused = false;
      state.pauseTime = undefined;
      state.hintsUsed = 0;
    },
    pauseSession: (state) => {
      state.isPaused = true;
      state.pauseTime = Date.now();
    },
    resumeSession: (state) => {
      state.isPaused = false;
      state.pauseTime = undefined;
    },
    useHint: (state) => {
      state.hintsUsed += 1;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateSessionStats: (state, action: PayloadAction<any>) => {
      state.sessionStats = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Start Session
    builder
      .addCase(startSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startSession.fulfilled, (state, action: PayloadAction<LearningSession>) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.currentWordIndex = 0;
        state.answers = [];
        state.results = [];
        state.isPaused = false;
        state.hintsUsed = 0;
      })
      .addCase(startSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Submit Answer
    builder
      .addCase(submitAnswer.fulfilled, (state, action: PayloadAction<SessionResult>) => {
        state.results.push(action.payload);
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Complete Session
    builder
      .addCase(completeSession.fulfilled, (state, action) => {
        if (state.currentSession) {
          state.sessionHistory.push({
            ...state.currentSession,
            completedAt: action.payload.completedAt,
          });
        }
        state.currentSession = null;
        state.currentWordIndex = 0;
        state.answers = [];
        state.results = [];
        state.isPaused = false;
        state.hintsUsed = 0;
      })
      .addCase(completeSession.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  nextWord,
  previousWord,
  addAnswer,
  clearSession,
  pauseSession,
  resumeSession,
  useHint,
  clearError,
  updateSessionStats,
} = learningSlice.actions;

export default learningSlice.reducer;
