// types/learning.ts
import { BaseEntity } from './common';
import { DifficultyLevel, PartOfSpeech, SessionType, LanguageCode } from './enums';

// Book entity
export interface Book extends BaseEntity {
  title: string;
  description: string;
  language: LanguageCode;
  totalWords: number;
  difficulty: DifficultyLevel;
  isPublic: boolean;
  author: string;
  categories: string[];
  estimatedTime: string; // e.g., "30 days"
  tags: string[];
  coverImage?: string;
  userProgress?: UserBookProgress;
  statistics?: BookStatistics;
}

// User's progress with a book
export interface UserBookProgress {
  isEnrolled: boolean;
  wordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  lastStudied?: string;
  completedAt?: string;
  progressPercentage: number;
  averageAccuracy: number;
  totalStudyTime: number; // minutes
  currentDay?: number;
  isCompleted: boolean;
}

// Book statistics
export interface BookStatistics {
  totalEnrollments: number;
  averageRating: number;
  totalRatings: number;
  completionRate: number;
  averageStudyTime: number;
  difficultyRating: number;
}

// Word entity
export interface Word extends BaseEntity {
  bookId: string;
  term: string;
  definition: string;
  pronunciation?: string;
  difficulty: DifficultyLevel;
  partOfSpeech: PartOfSpeech;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  etymology?: string;
  frequency?: number; // Word frequency rank
  tags: string[];
  audioUrl?: string;
  imageUrl?: string;
  userProgress?: WordProgress;
}

// User's progress with a specific word
export interface WordProgress {
  masteryLevel: number; // 1-5 scale
  nextReview: string; // ISO date
  timesReviewed: number;
  timesCorrect: number;
  lastCorrect: boolean;
  lastReviewed?: string;
  totalTimeSpent: number; // seconds
  confidence: number; // 1-5 scale
  isMastered: boolean;
  streak: number;
  difficultyAdjustment: number; // Spaced repetition factor
}

// Learning session
export interface LearningSession extends BaseEntity {
  userId: string;
  bookId: string;
  day?: number;
  sessionType: SessionType;
  startedAt: string;
  completedAt?: string;
  totalWords: number;
  words: SessionWord[];
  answers: SessionAnswer[];
  results: SessionResult[];
  statistics: SessionStatistics;
  isActive: boolean;
}

// Word in a learning session
export interface SessionWord {
  id: string;
  term: string;
  definition: string;
  pronunciation?: string;
  difficulty: DifficultyLevel;
  partOfSpeech: PartOfSpeech;
  examples: string[];
  isNew: boolean;
  userProgress?: WordProgress;
  order: number;
}

// User's answer to a word
export interface SessionAnswer {
  wordId: string;
  answer: string;
  responseTime: number; // seconds
  confidence: number; // 1-5 scale
  submittedAt: string;
  isCorrect?: boolean;
  hintsUsed: number;
  attempts: number;
}

// Result of answering a word
export interface SessionResult {
  wordId: string;
  isCorrect: boolean;
  score: number; // 0-100
  masteryLevel: number;
  nextReview: string;
  feedback: string;
  timeSpent: number; // seconds
  hintsUsed: number;
  attempts: number;
  improvement: number; // Score improvement
}

// Session statistics
export interface SessionStatistics {
  totalWords: number;
  correctAnswers: number;
  accuracy: number;
  averageResponseTime: number;
  totalTime: number; // seconds
  newWords: number;
  reviewWords: number;
  hintsUsed: number;
  score: number; // Overall session score
  improvement: number; // Compared to previous session
}

// Daily words response
export interface DailyWordsResponse {
  day: number;
  bookId: string;
  words: DailyWord[];
  totalWords: number;
  newWords: number;
  reviewWords: number;
  estimatedTime: string;
  isCompleted: boolean;
  completedAt?: string;
}

// Word for daily learning
export interface DailyWord extends SessionWord {
  isCompleted: boolean;
  completedAt?: string;
  score?: number;
}

// Start session request
export interface StartSessionRequest {
  bookId: string;
  day?: number;
  sessionType: SessionType;
  wordCount?: number;
  difficultyFilter?: DifficultyLevel[];
  includeNewWords?: boolean;
  includeReviewWords?: boolean;
}

// Submit answer request
export interface SubmitAnswerRequest {
  wordId: string;
  answer: string;
  responseTime: number;
  confidence: number;
  hintsUsed?: number;
  attempts?: number;
}

// Learning session request (alias for StartSessionRequest)
export interface LearningSessionRequest extends StartSessionRequest {}

// Answer submission (alias for SubmitAnswerRequest)
export interface AnswerSubmission extends SubmitAnswerRequest {}

// Answer response
export interface AnswerResponse {
  wordId: string;
  isCorrect: boolean;
  score: number;
  masteryLevel: number;
  nextReview: string;
  feedback: string;
  timeSpent: number;
  hintsUsed: number;
  attempts: number;
  improvement: number;
}

// Session history
export interface SessionHistory {
  id: string;
  bookId: string;
  bookTitle: string;
  day?: number;
  sessionType: SessionType;
  startedAt: string;
  completedAt?: string;
  totalWords: number;
  correctAnswers: number;
  accuracy: number;
  score: number;
  duration: number; // seconds
  isCompleted: boolean;
}

// Book enrollment
export interface BookEnrollment {
  id: string;
  userId: string;
  bookId: string;
  enrolledAt: string;
  progress: UserBookProgress;
  book: Book;
}

// Book word (word with book context)
export interface BookWord extends Word {
  bookTitle: string;
  day?: number;
  order?: number;
}

// Daily words
export interface DailyWords extends DailyWordsResponse {}