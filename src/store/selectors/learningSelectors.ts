// store/selectors/learningSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../types/store';

// Basic selectors
export const selectLearning = (state: RootState) => state.learning;
export const selectCurrentSession = (state: RootState) => state.learning.currentSession;
export const selectSessionHistory = (state: RootState) => state.learning.sessionHistory;
export const selectCurrentWordIndex = (state: RootState) => state.learning.currentWordIndex;
export const selectAnswers = (state: RootState) => state.learning.answers;
export const selectResults = (state: RootState) => state.learning.results;
export const selectLearningLoading = (state: RootState) => state.learning.isLoading;
export const selectLearningError = (state: RootState) => state.learning.error;
export const selectSessionStats = (state: RootState) => state.learning.sessionStats;
export const selectIsPaused = (state: RootState) => state.learning.isPaused;
export const selectPauseTime = (state: RootState) => state.learning.pauseTime;
export const selectHintsUsed = (state: RootState) => state.learning.hintsUsed;
export const selectTotalHints = (state: RootState) => state.learning.totalHints;

// Memoized selectors
export const selectCurrentWord = createSelector(
  [selectCurrentSession, selectCurrentWordIndex],
  (session, wordIndex) => {
    if (!session || !session.words || wordIndex < 0) return null;
    return session.words[wordIndex] || null;
  }
);

export const selectSessionProgress = createSelector(
  [selectCurrentSession, selectCurrentWordIndex],
  (session, wordIndex) => {
    if (!session || !session.words) return 0;
    return ((wordIndex + 1) / session.words.length) * 100;
  }
);

export const selectIsFirstWord = createSelector(
  [selectCurrentWordIndex],
  (wordIndex) => wordIndex === 0
);

export const selectIsLastWord = createSelector(
  [selectCurrentSession, selectCurrentWordIndex],
  (session, wordIndex) => {
    if (!session || !session.words) return false;
    return wordIndex >= session.words.length - 1;
  }
);

export const selectWordsRemaining = createSelector(
  [selectCurrentSession, selectCurrentWordIndex],
  (session, wordIndex) => {
    if (!session || !session.words) return 0;
    return Math.max(0, session.words.length - wordIndex - 1);
  }
);

export const selectHintsRemaining = createSelector(
  [selectHintsUsed, selectTotalHints],
  (hintsUsed, totalHints) => Math.max(0, totalHints - hintsUsed)
);

export const selectCanUseHint = createSelector(
  [selectHintsRemaining],
  (hintsRemaining) => hintsRemaining > 0
);

export const selectSessionDuration = createSelector(
  [selectCurrentSession, selectPauseTime],
  (session, pauseTime) => {
    if (!session) return 0;
    const now = Date.now();
    const startTime = new Date(session.startTime).getTime();
    const totalPauseTime = pauseTime || 0;
    return now - startTime - totalPauseTime;
  }
);

export const selectSessionAccuracy = createSelector(
  [selectAnswers],
  (answers) => {
    if (answers.length === 0) return 0;
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    return (correctAnswers / answers.length) * 100;
  }
);

export const selectAverageResponseTime = createSelector(
  [selectAnswers],
  (answers) => {
    if (answers.length === 0) return 0;
    const totalTime = answers.reduce((sum, answer) => sum + (answer.responseTime || 0), 0);
    return totalTime / answers.length;
  }
);

export const selectLearningStatus = createSelector(
  [selectLearningLoading, selectLearningError, selectCurrentSession],
  (isLoading, error, session) => ({
    isLoading,
    error,
    hasError: !!error,
    hasSession: !!session,
    isReady: !isLoading && !error
  })
);

export const selectSessionSummary = createSelector(
  [selectCurrentSession, selectAnswers, selectSessionAccuracy, selectAverageResponseTime, selectHintsUsed],
  (session, answers, accuracy, avgResponseTime, hintsUsed) => ({
    totalWords: session?.words?.length || 0,
    answeredWords: answers.length,
    correctAnswers: answers.filter(a => a.isCorrect).length,
    accuracy,
    avgResponseTime,
    hintsUsed,
    timeSpent: session ? Date.now() - new Date(session.startTime).getTime() : 0
  })
);
