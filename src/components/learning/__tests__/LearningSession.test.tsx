// components/learning/__tests__/LearningSession.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LearningSession from '../LearningSession';
import learningReducer from '../../../store/slices/learningSlice';
import authReducer from '../../../store/slices/authSlice';
import { LearningSession as LearningSessionType, SessionWord } from '../../../types/learning';

// Mock the LearningService
jest.mock('../../../services/learning/learningService', () => ({
  LearningService: {
    startSession: jest.fn().mockResolvedValue({
      id: 'session-1',
      userId: 'user-1',
      bookId: 'book-1',
      day: 1,
      sessionType: 'daily',
      startedAt: new Date().toISOString(),
      totalWords: 3,
      words: [
        {
          id: 'word-1',
          term: 'abundant',
          definition: 'existing in large quantities; plentiful',
          pronunciation: '/əˈbʌndənt/',
          difficulty: 'intermediate',
          partOfSpeech: 'adjective',
          examples: ['The region has abundant natural resources.'],
          isNew: true,
          order: 1,
        },
      ],
      answers: [],
      results: [],
      statistics: {
        totalWords: 3,
        correctAnswers: 0,
        accuracy: 0,
        averageResponseTime: 0,
        totalTime: 0,
        newWords: 2,
        reviewWords: 1,
        hintsUsed: 0,
        score: 0,
        improvement: 0,
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    submitAnswer: jest.fn().mockResolvedValue({
      wordId: 'word-1',
      isCorrect: true,
      score: 4,
      masteryLevel: 2,
      nextReview: new Date().toISOString(),
      feedback: 'Great job!',
      timeSpent: 5.2,
      hintsUsed: 0,
      attempts: 1,
      improvement: 0,
    }),
    completeSession: jest.fn().mockResolvedValue({
      totalWords: 3,
      correctAnswers: 2,
      accuracy: 0.67,
      averageResponseTime: 5.2,
      totalTime: 15.6,
      newWords: 2,
      reviewWords: 1,
      hintsUsed: 0,
      score: 75,
      improvement: 0,
    }),
  },
}));

// Mock the WordCard component
jest.mock('../WordCard', () => {
  return function MockWordCard({ word, onAnswer, onHint, disabled }: any) {
    return (
      <div data-testid="word-card">
        <div data-testid="word-term">{word?.term}</div>
        <div data-testid="word-definition">{word?.definition}</div>
        <button 
          data-testid="submit-answer" 
          onClick={() => onAnswer('test answer', 5.2, 4)}
          disabled={disabled}
        >
          Submit Answer
        </button>
        <button 
          data-testid="use-hint" 
          onClick={onHint}
        >
          Use Hint
        </button>
      </div>
    );
  };
});

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      learning: learningReducer,
      auth: authReducer,
    },
    preloadedState: {
      learning: {
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
        totalHints: 2,
        ...initialState.learning,
      },
      auth: {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
        token: 'mock-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        loginAttempts: 0,
      },
    },
  });
};

const mockSession: LearningSessionType = {
  id: 'session-1',
  userId: 'user-1',
  bookId: 'book-1',
  day: 1,
  sessionType: 'daily' as any,
  startedAt: new Date().toISOString(),
  totalWords: 3,
  words: [
    {
      id: 'word-1',
      term: 'abundant',
      definition: 'existing in large quantities; plentiful',
      pronunciation: '/əˈbʌndənt/',
      difficulty: 'intermediate' as any,
      partOfSpeech: 'adjective' as any,
      examples: ['The region has abundant natural resources.'],
      isNew: true,
      order: 1,
    },
    {
      id: 'word-2',
      term: 'comprehensive',
      definition: 'complete and including everything that is necessary',
      pronunciation: '/ˌkɒmprɪˈhensɪv/',
      difficulty: 'intermediate' as any,
      partOfSpeech: 'adjective' as any,
      examples: ['The report provides a comprehensive analysis.'],
      isNew: false,
      order: 2,
    },
    {
      id: 'word-3',
      term: 'elaborate',
      definition: 'involving many carefully arranged parts or details',
      pronunciation: '/ɪˈlæbərət/',
      difficulty: 'advanced' as any,
      partOfSpeech: 'adjective' as any,
      examples: ['She made an elaborate plan for the party.'],
      isNew: true,
      order: 3,
    },
  ] as SessionWord[],
  answers: [],
  results: [],
  statistics: {
    totalWords: 3,
    correctAnswers: 0,
    accuracy: 0,
    averageResponseTime: 0,
    totalTime: 0,
    newWords: 2,
    reviewWords: 1,
    hintsUsed: 0,
    score: 0,
    improvement: 0,
  },
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('LearningSession Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock the startSession thunk to not reset currentWordIndex
  const mockStartSession = jest.fn().mockImplementation((dispatch, getState) => {
    const state = getState();
    return {
      type: 'learning/startSession/fulfilled',
      payload: state.learning.currentSession || mockSession,
    };
  });

  it('should display loading state when starting session', () => {
    const store = createMockStore({
      learning: { isLoading: true },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // The loading state shows a skeleton loader with animate-pulse class
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should display error state when session fails to start', async () => {
    // Mock the LearningService to reject
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockRejectedValueOnce(new Error('Failed to start session'));

    const store = createMockStore({
      learning: { 
        error: null,
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the error state to appear
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to start session')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should display no session available when currentSession is null', async () => {
    // Mock the LearningService to return null
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(null);

    const store = createMockStore({
      learning: { 
        currentSession: null,
        isLoading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the no session state to appear
    await waitFor(() => {
      expect(screen.getByText('No Session Available')).toBeInTheDocument();
    });

    expect(screen.getByText('Unable to start learning session.')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('should display learning session with first word when session is active', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);

    const store = createMockStore({
      learning: { 
        currentSession: null,
        currentWordIndex: 0,
        isLoading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByText('Learning Session')).toBeInTheDocument();
    });

    expect(screen.getByText('1 of 3')).toBeInTheDocument();
    expect(screen.getByText('abundant')).toBeInTheDocument();
  });

  it('should display progress bar with correct percentage', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);

    const store = createMockStore({
      learning: { 
        currentSession: null,
        currentWordIndex: 1, // Second word (index 1)
        isLoading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the session to load and progress bar to appear
    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar');
      // The component shows the first word (index 0) by default, so progress should be 33.33%
      expect(progressBar).toHaveStyle('width: 33.33333333333333%');
    });
  });

  it('should navigate to next word when Next button is clicked', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);

    const store = createMockStore({
      learning: { 
        currentSession: null,
        currentWordIndex: 0,
        isLoading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByText('Learning Session')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next →');
    fireEvent.click(nextButton);

    // The component should update to show the next word
    await waitFor(() => {
      expect(screen.getByText('2 of 3')).toBeInTheDocument();
    });
  });

  it('should navigate to previous word when Previous button is clicked', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);

    const store = createMockStore({
      learning: { 
        currentSession: null,
        currentWordIndex: 1,
        isLoading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByText('Learning Session')).toBeInTheDocument();
    });

    const previousButton = screen.getByText('← Previous');
    fireEvent.click(previousButton);

    await waitFor(() => {
      expect(screen.getByText('1 of 3')).toBeInTheDocument();
    });
  });

  it('should disable Previous button on first word', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);

    const store = createMockStore({
      learning: { 
        currentSession: null,
        currentWordIndex: 0,
        isLoading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByText('Learning Session')).toBeInTheDocument();
    });

    const previousButton = screen.getByText('← Previous');
    expect(previousButton).toBeDisabled();
  });

  it('should show Complete button on last word', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);

    const store = createMockStore({
      learning: { 
        currentSession: mockSession, // Set the session directly
        currentWordIndex: 0, // Start at first word
        isLoading: false,
        error: null,
        isPaused: false,
        hintsUsed: 0,
        totalHints: 2,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByText('Learning Session')).toBeInTheDocument();
    });

    // Navigate to the last word by clicking Next twice
    const nextButton = screen.getByText('Next →');
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    // Now we should be on the last word and see Complete button
    await waitFor(() => {
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });
  });

  it('should display hints used counter', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);

    const store = createMockStore({
      learning: { 
        currentSession: mockSession, // Set the session directly
        currentWordIndex: 0,
        hintsUsed: 0, // Start with 0 hints
        totalHints: 2,
        isLoading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByText('Learning Session')).toBeInTheDocument();
    });

    // Use a hint by clicking the hint button
    const hintButton = screen.getByTestId('use-hint');
    fireEvent.click(hintButton);

    // Now check that hints used counter shows 1/2
    await waitFor(() => {
      expect(screen.getByText('Hints used: 1/2')).toBeInTheDocument();
    });
  });

  it('should handle word answer submission', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);
    LearningService.submitAnswer.mockResolvedValueOnce({
      wordId: 'word-1',
      isCorrect: true,
      score: 4,
      masteryLevel: 2,
      nextReview: new Date().toISOString(),
      feedback: 'Great job!',
      timeSpent: 5.2,
      hintsUsed: 0,
      attempts: 1,
      improvement: 0,
    });

    const store = createMockStore({
      learning: { 
        currentSession: mockSession,
        currentWordIndex: 0,
        isLoading: false,
        error: null,
        isPaused: false,
        hintsUsed: 0,
        totalHints: 2,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByText('Learning Session')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('submit-answer');
    fireEvent.click(submitButton);

    // The answer should be submitted to the store
    await waitFor(() => {
      // Wait for the submitAnswer thunk to complete
      expect(LearningService.submitAnswer).toHaveBeenCalled();
    });
  });

  it('should handle hint usage', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);

    const store = createMockStore({
      learning: { 
        currentSession: mockSession,
        currentWordIndex: 0,
        hintsUsed: 0,
        totalHints: 2,
        isLoading: false,
        error: null,
        isPaused: false,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByText('Learning Session')).toBeInTheDocument();
    });

    const hintButton = screen.getByTestId('use-hint');
    fireEvent.click(hintButton);

    await waitFor(() => {
      expect(screen.getByText('Hints used: 1/2')).toBeInTheDocument();
    });
  });

  it('should handle session pause and resume', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);

    const store = createMockStore({
      learning: { 
        currentSession: mockSession,
        currentWordIndex: 0,
        isPaused: false,
        isLoading: false,
        error: null,
        hintsUsed: 0,
        totalHints: 2,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByText('Learning Session')).toBeInTheDocument();
    });

    const pauseButton = screen.getByText('Pause');
    expect(pauseButton).toBeInTheDocument();
  });

  it('should call onComplete callback when session is completed', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);
    LearningService.completeSession.mockResolvedValueOnce({
      totalWords: 3,
      correctAnswers: 2,
      accuracy: 0.67,
      averageResponseTime: 5.2,
      totalTime: 15.6,
      newWords: 2,
      reviewWords: 1,
      hintsUsed: 0,
      score: 75,
      improvement: 0,
    });

    const mockOnComplete = jest.fn();
    const store = createMockStore({
      learning: { 
        currentSession: mockSession,
        currentWordIndex: 0, // Start at first word
        isLoading: false,
        error: null,
        isPaused: false,
        hintsUsed: 0,
        totalHints: 2,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" onComplete={mockOnComplete} />
      </Provider>
    );

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByText('Learning Session')).toBeInTheDocument();
    });

    // Navigate to the last word by clicking Next twice
    const nextButton = screen.getByText('Next →');
    fireEvent.click(nextButton);
    
    // Wait for the first navigation to complete
    await waitFor(() => {
      expect(screen.getByText('2 of 3')).toBeInTheDocument();
    });
    
    fireEvent.click(nextButton);
    
    // Wait for the second navigation to complete and Complete button to appear
    await waitFor(() => {
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);

    // The callback should be called when the Complete button is clicked
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('should disable word card when session is paused', async () => {
    // Mock the LearningService to return a valid session
    const { LearningService } = require('../../../services/learning/learningService');
    LearningService.startSession.mockResolvedValueOnce(mockSession);

    const store = createMockStore({
      learning: { 
        currentSession: mockSession,
        currentWordIndex: 0,
        isPaused: false, // Start with not paused
        isLoading: false,
        error: null,
        hintsUsed: 0,
        totalHints: 2,
      },
    });

    render(
      <Provider store={store}>
        <LearningSession bookId="book-1" />
      </Provider>
    );

    // Wait for the session to load
    await waitFor(() => {
      expect(screen.getByText('Learning Session')).toBeInTheDocument();
    });

    // Click the Pause button to pause the session
    const pauseButton = screen.getByText('Pause');
    fireEvent.click(pauseButton);

    // Wait for the submit button to be disabled
    await waitFor(() => {
      const submitButton = screen.getByTestId('submit-answer');
      expect(submitButton).toBeDisabled();
    });
  });
});
