// store/slices/learningSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LearningSession, SessionAnswer, SessionResult, StartSessionRequest, AnswerSubmission, AnswerResponse, SessionHistory } from '../../types/learning';
import { LearningState } from '../../types/store';
import { LearningService } from '../../services/learning/learningService';

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

// Async thunks using real API service
export const startSession = createAsyncThunk(
  'learning/startSession',
  async (sessionData: StartSessionRequest, { rejectWithValue }) => {
    try {
      const session = await LearningService.startSession(sessionData);
      return session;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to start session');
    }
  }
);

export const submitAnswer = createAsyncThunk(
  'learning/submitAnswer',
  async ({ sessionId, answer }: { sessionId: string; answer: AnswerSubmission }, { rejectWithValue }) => {
    try {
      const response = await LearningService.submitAnswer(sessionId, answer);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit answer');
    }
  }
);

export const completeSession = createAsyncThunk(
  'learning/completeSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const statistics = await LearningService.completeSession(sessionId);
      return statistics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete session');
    }
  }
);

export const fetchSessionHistory = createAsyncThunk(
  'learning/fetchSessionHistory',
  async (params: { limit?: number; offset?: number } = {}, { rejectWithValue }) => {
    try {
      const history = await LearningService.getSessionHistory(params.limit, params.offset);
      return history;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch session history');
    }
  }
);

export const fetchCurrentSession = createAsyncThunk(
  'learning/fetchCurrentSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await LearningService.getCurrentSession();
      return session;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch current session');
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
      state.pauseTime = new Date();
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
      .addCase(submitAnswer.fulfilled, (state, action: PayloadAction<AnswerResponse>) => {
        // Convert AnswerResponse to SessionResult format
        const sessionResult = {
          wordId: action.payload.wordId || '',
          isCorrect: action.payload.isCorrect,
          score: action.payload.score,
          masteryLevel: action.payload.masteryLevel,
          nextReview: action.payload.nextReview,
          feedback: action.payload.feedback,
          timeSpent: action.payload.timeSpent,
          hintsUsed: action.payload.hintsUsed,
          attempts: action.payload.attempts,
          improvement: action.payload.improvement,
        };
        state.results.push(sessionResult);
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
            completedAt: new Date().toISOString(),
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

    // Fetch Session History
    builder
      .addCase(fetchSessionHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSessionHistory.fulfilled, (state, action: PayloadAction<SessionHistory[]>) => {
        state.isLoading = false;
        state.sessionHistory = action.payload;
      })
      .addCase(fetchSessionHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Current Session
    builder
      .addCase(fetchCurrentSession.fulfilled, (state, action: PayloadAction<LearningSession | null>) => {
        state.currentSession = action.payload;
        if (action.payload) {
          state.currentWordIndex = 0;
          state.answers = action.payload.answers || [];
          state.results = action.payload.results || [];
        }
      })
      .addCase(fetchCurrentSession.rejected, (state, action) => {
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
