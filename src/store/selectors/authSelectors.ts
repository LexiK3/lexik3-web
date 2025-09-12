// store/selectors/authSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../types/store';

// Basic selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectToken = (state: RootState) => state.auth.token;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectIsRefreshing = (state: RootState) => state.auth.isRefreshing;
export const selectLastActivity = (state: RootState) => state.auth.lastActivity;
export const selectLoginAttempts = (state: RootState) => state.auth.loginAttempts;

// Memoized selectors
export const selectUserDisplayName = createSelector(
  [selectUser],
  (user) => user ? `${user.firstName} ${user.lastName}`.trim() : null
);

export const selectUserInitials = createSelector(
  [selectUser],
  (user) => {
    if (!user) return null;
    const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }
);

export const selectIsEmailVerified = createSelector(
  [selectUser],
  (user) => user?.isEmailVerified || false
);

export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectAuthLoading, selectIsRefreshing],
  (isAuthenticated, isLoading, isRefreshing) => ({
    isAuthenticated,
    isLoading,
    isRefreshing,
    isReady: !isLoading && !isRefreshing
  })
);

export const selectAuthErrorDetails = createSelector(
  [selectAuthError, selectLoginAttempts],
  (error, loginAttempts) => ({
    error,
    loginAttempts,
    hasError: !!error,
    isLocked: loginAttempts >= 5
  })
);
