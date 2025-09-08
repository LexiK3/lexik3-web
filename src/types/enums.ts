// types/enums.ts

// Difficulty levels for words and books
export enum DifficultyLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert'
}

// Parts of speech for words
export enum PartOfSpeech {
  Noun = 'noun',
  Verb = 'verb',
  Adjective = 'adjective',
  Adverb = 'adverb',
  Preposition = 'preposition',
  Conjunction = 'conjunction',
  Interjection = 'interjection',
  Pronoun = 'pronoun',
  Determiner = 'determiner',
  Particle = 'particle'
}

// Learning session types
export enum SessionType {
  Daily = 'daily',
  Review = 'review',
  Custom = 'custom',
  Practice = 'practice',
  Test = 'test'
}

// User roles and permissions
export enum UserRole {
  Student = 'student',
  Teacher = 'teacher',
  Admin = 'admin',
  Moderator = 'moderator'
}

// Achievement types
export enum AchievementType {
  Streak = 'streak',
  Progress = 'progress',
  Learning = 'learning',
  Social = 'social',
  Special = 'special'
}

// Notification types
export enum NotificationType {
  Achievement = 'achievement',
  Reminder = 'reminder',
  Progress = 'progress',
  System = 'system',
  Social = 'social'
}

// Theme options
export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto'
}

// Language codes (ISO 639-1)
export enum LanguageCode {
  English = 'en',
  Spanish = 'es',
  French = 'fr',
  German = 'de',
  Italian = 'it',
  Portuguese = 'pt',
  Russian = 'ru',
  Chinese = 'zh',
  Japanese = 'ja',
  Korean = 'ko'
}
