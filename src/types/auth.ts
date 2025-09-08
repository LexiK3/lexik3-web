// types/auth.ts
import { BaseEntity } from './common';
import { UserRole, LanguageCode, Theme } from './enums';

// User entity
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  preferences: UserPreferences;
  profile?: UserProfile;
}

// User preferences
export interface UserPreferences {
  language: LanguageCode;
  theme: Theme;
  dailyGoal: number;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  learning: LearningPreferences;
}

// Notification settings
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  achievements: boolean;
  reminders: boolean;
  progress: boolean;
  social: boolean;
}

// Privacy settings
export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showProgress: boolean;
  showAchievements: boolean;
  allowFriendRequests: boolean;
}

// Learning preferences
export interface LearningPreferences {
  sessionDuration: number; // minutes
  wordsPerSession: number;
  difficultyPreference: string;
  autoAdvance: boolean;
  showHints: boolean;
  soundEnabled: boolean;
}

// User profile (optional extended info)
export interface UserProfile {
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  socialLinks?: SocialLinks;
  interests?: string[];
  learningGoals?: string[];
}

// Social links
export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

// Authentication request/response types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  newsletter?: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// JWT payload
export interface JWTPayload {
  sub: string; // User ID
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  iat: number; // Issued at
  exp: number; // Expires at
  iss: string; // Issuer
  aud: string; // Audience
}
