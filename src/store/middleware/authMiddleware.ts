// store/middleware/authMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../../types/store';

export const authMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: any) => {
  // Check if user is authenticated before certain actions
  if (action.type.startsWith('learning/') || action.type.startsWith('progress/')) {
    const state = store.getState();
    if (!state.auth.isAuthenticated) {
      console.warn('Action requires authentication:', action.type);
      return;
    }
  }

  // Update last activity on user actions
  if (action.type.startsWith('learning/') || action.type.startsWith('progress/')) {
    store.dispatch({ type: 'auth/updateLastActivity' });
  }

  return next(action);
};
