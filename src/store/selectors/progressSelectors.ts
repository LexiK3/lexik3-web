// store/selectors/progressSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../types/store';

// Basic selectors
export const selectProgress = (state: RootState) => state.progress;
export const selectUserProgress = (state: RootState) => state.progress.userProgress;
export const selectDailyProgress = (state: RootState) => state.progress.dailyProgress;
export const selectStatistics = (state: RootState) => state.progress.statistics;
export const selectAchievements = (state: RootState) => state.progress.achievements;
export const selectProgressLoading = (state: RootState) => state.progress.isLoading;
export const selectProgressError = (state: RootState) => state.progress.error;
export const selectLastUpdated = (state: RootState) => state.progress.lastUpdated;
export const selectSelectedPeriod = (state: RootState) => state.progress.selectedPeriod;
export const selectSelectedBook = (state: RootState) => state.progress.selectedBook;

// Memoized selectors
export const selectOverallStats = createSelector(
  [selectUserProgress],
  (progress) => {
    if (!progress) return null;
    return {
      totalWordsLearned: progress.overall.totalWordsLearned,
      currentStreak: progress.overall.currentStreak,
      longestStreak: progress.overall.longestStreak,
      accuracy: progress.overall.accuracy,
      level: progress.overall.level,
      experience: progress.overall.experience,
      nextLevelExperience: progress.overall.nextLevelExperience
    };
  }
);

export const selectBookProgress = createSelector(
  [selectUserProgress, selectSelectedBook],
  (progress, selectedBook) => {
    if (!progress || !selectedBook) return null;
    return progress.books.find(book => book.bookId === selectedBook) || null;
  }
);

export const selectRecentActivity = createSelector(
  [selectDailyProgress],
  (dailyProgress) => {
    const sorted = [...dailyProgress].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted.slice(0, 7); // Last 7 days
  }
);

export const selectWeeklyStats = createSelector(
  [selectDailyProgress],
  (dailyProgress) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyData = dailyProgress.filter(activity => 
      new Date(activity.date) >= weekAgo
    );

    return {
      totalWords: weeklyData.reduce((sum, day) => sum + day.wordsLearned, 0),
      totalSessions: weeklyData.reduce((sum, day) => sum + day.sessionsCompleted, 0),
      averageAccuracy: weeklyData.length > 0 
        ? weeklyData.reduce((sum, day) => sum + day.accuracy, 0) / weeklyData.length 
        : 0,
      streakDays: weeklyData.filter(day => day.wordsLearned > 0).length
    };
  }
);

export const selectMonthlyStats = createSelector(
  [selectDailyProgress],
  (dailyProgress) => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const monthlyData = dailyProgress.filter(activity => 
      new Date(activity.date) >= monthAgo
    );

    return {
      totalWords: monthlyData.reduce((sum, day) => sum + day.wordsLearned, 0),
      totalSessions: monthlyData.reduce((sum, day) => sum + day.sessionsCompleted, 0),
      averageAccuracy: monthlyData.length > 0 
        ? monthlyData.reduce((sum, day) => sum + day.accuracy, 0) / monthlyData.length 
        : 0,
      activeDays: monthlyData.filter(day => day.wordsLearned > 0).length
    };
  }
);

export const selectUnlockedAchievements = createSelector(
  [selectAchievements],
  (achievements) => achievements.filter(achievement => achievement.isUnlocked)
);

export const selectLockedAchievements = createSelector(
  [selectAchievements],
  (achievements) => achievements.filter(achievement => !achievement.isUnlocked)
);

export const selectRecentAchievements = createSelector(
  [selectUnlockedAchievements],
  (achievements) => {
    const sorted = [...achievements].sort((a, b) => 
      new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
    );
    return sorted.slice(0, 5); // Last 5 achievements
  }
);

export const selectProgressByPeriod = createSelector(
  [selectDailyProgress, selectSelectedPeriod],
  (dailyProgress, period) => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return dailyProgress;
    }

    return dailyProgress.filter(activity => 
      new Date(activity.date) >= startDate
    );
  }
);

export const selectProgressStatus = createSelector(
  [selectProgressLoading, selectProgressError, selectUserProgress],
  (isLoading, error, progress) => ({
    isLoading,
    error,
    hasError: !!error,
    hasData: !!progress,
    isReady: !isLoading && !error
  })
);

export const selectLevelProgress = createSelector(
  [selectOverallStats],
  (stats) => {
    if (!stats) return null;
    const progress = (stats.experience / stats.nextLevelExperience) * 100;
    return {
      currentLevel: stats.level,
      experience: stats.experience,
      nextLevelExperience: stats.nextLevelExperience,
      progress: Math.min(100, progress)
    };
  }
);
