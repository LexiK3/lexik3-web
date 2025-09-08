// types/progress.ts
import { BaseEntity } from './common';
import { DifficultyLevel, PartOfSpeech, AchievementType } from './enums';

// Overall user progress
export interface UserProgress {
  userId: string;
  overall: OverallProgress;
  byBook: BookProgress[];
  recentActivity: DailyActivity[];
  achievements: Achievement[];
  statistics: LearningStatistics;
  lastUpdated: string;
}

// Overall progress summary
export interface OverallProgress {
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number; // minutes
  accuracy: number; // 0-1
  level: string; // e.g., "Intermediate"
  experience: number; // XP points
  rank: number; // User ranking
  percentile: number; // Percentile ranking
}

// Progress for a specific book
export interface BookProgress {
  bookId: string;
  bookTitle: string;
  wordsLearned: number;
  totalWords: number;
  progress: number; // 0-1
  currentStreak: number;
  lastStudied?: string;
  isCompleted: boolean;
  completedAt?: string;
  averageAccuracy: number;
  totalStudyTime: number; // minutes
  currentDay?: number;
  estimatedCompletion?: string;
}

// Daily activity record
export interface DailyActivity {
  date: string; // YYYY-MM-DD
  wordsStudied: number;
  accuracy: number;
  studyTime: number; // minutes
  sessionsCompleted: number;
  newWordsLearned: number;
  wordsReviewed: number;
  streakMaintained: boolean;
  achievementsUnlocked: number;
  booksStudied: string[];
}

// Achievement system
export interface Achievement extends BaseEntity {
  name: string;
  description: string;
  type: AchievementType;
  category: string;
  icon: string;
  points: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: AchievementRequirement[];
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0-1
  isSecret: boolean;
}

// Achievement requirements
export interface AchievementRequirement {
  type: 'streak' | 'words' | 'accuracy' | 'time' | 'books' | 'sessions';
  value: number;
  description: string;
  isCompleted: boolean;
}

// Learning statistics
export interface LearningStatistics {
  studyTime: StudyTimeStats;
  accuracy: AccuracyStats;
  words: WordStats;
  streaks: StreakStats;
  sessions: SessionStats;
  trends: TrendStats;
}

// Study time statistics
export interface StudyTimeStats {
  total: number; // minutes
  averagePerDay: number;
  averagePerSession: number;
  byDayOfWeek: Record<string, number>;
  byHourOfDay: Record<string, number>;
  longestSession: number;
  totalSessions: number;
}

// Accuracy statistics
export interface AccuracyStats {
  overall: number; // 0-1
  byDifficulty: Record<DifficultyLevel, number>;
  byPartOfSpeech: Record<PartOfSpeech, number>;
  trend: 'improving' | 'stable' | 'declining';
  bestDay: string;
  worstDay: string;
  averageImprovement: number;
}

// Word statistics
export interface WordStats {
  totalLearned: number;
  newThisWeek: number;
  reviewedThisWeek: number;
  mastered: number;
  inProgress: number;
  masteryDistribution: Record<string, number>;
  averageTimeToMaster: number; // days
  retentionRate: number; // 0-1
}

// Streak statistics
export interface StreakStats {
  current: number;
  longest: number;
  average: number;
  total: number;
  bestMonth: string;
  consistency: number; // 0-1
}

// Session statistics
export interface SessionStats {
  total: number;
  averagePerDay: number;
  averageDuration: number; // minutes
  completionRate: number; // 0-1
  bestSession: any; // SessionStatistics
  averageScore: number;
  improvementRate: number; // 0-1
}

// Trend statistics
export interface TrendStats {
  weeklyGrowth: number; // percentage
  monthlyGrowth: number; // percentage
  accuracyTrend: number; // slope
  timeTrend: number; // slope
  wordTrend: number; // slope
  streakTrend: number; // slope
}

// Progress query parameters
export interface ProgressQueryParams {
  period?: 'week' | 'month' | 'year' | 'all';
  bookId?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}

// Daily progress request
export interface DailyProgressRequest {
  bookId: string;
  day: number;
  completedAt: string;
  wordsStudied: number;
  accuracy: number;
  studyTime: number; // minutes
}

// Progress overview (alias for UserProgress)
export interface ProgressOverview extends UserProgress {}

// Daily progress (alias for DailyActivity)
export interface DailyProgress extends DailyActivity {}

// Statistics (alias for LearningStatistics)
export interface Statistics extends LearningStatistics {}

// Progress data (alias for BookProgress)
export interface ProgressData extends BookProgress {}

// Streak data
export interface StreakData {
  current: number;
  longest: number;
  average: number;
  total: number;
  bestMonth: string;
  consistency: number;
  lastStudied?: string;
  nextMilestone: number;
  milestones: StreakMilestone[];
}

// Streak milestone
export interface StreakMilestone {
  days: number;
  name: string;
  description: string;
  isAchieved: boolean;
  achievedAt?: string;
}