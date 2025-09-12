// store/middleware/authMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../../types/store';

export const authMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: any) => {
  const state = store.getState();
  const { isAuthenticated, lastActivity } = state.auth;
  
  // Check if user is authenticated before certain actions
  const protectedActions = ['learning/', 'progress/', 'user/'];
  const requiresAuth = protectedActions.some(prefix => action.type.startsWith(prefix));
  
  if (requiresAuth && !isAuthenticated) {
    console.warn('Action requires authentication:', action.type);
    
    // Dispatch auth required action
    store.dispatch({ 
      type: 'ui/addToast', 
      payload: {
        id: Date.now().toString(),
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please log in to perform this action.',
        duration: 3000
      }
    });
    
    return;
  }

  // Update last activity on user actions
  const userActions = ['learning/', 'progress/', 'books/enroll', 'books/unenroll'];
  const isUserAction = userActions.some(prefix => action.type.startsWith(prefix));
  
  if (isUserAction && isAuthenticated) {
    store.dispatch({ type: 'auth/updateLastActivity' });
  }

  // Check for session timeout (30 minutes of inactivity)
  if (isAuthenticated && lastActivity) {
    const now = Date.now();
    const lastActivityTime = new Date(lastActivity).getTime();
    const timeoutDuration = 30 * 60 * 1000; // 30 minutes
    
    if (now - lastActivityTime > timeoutDuration) {
      console.warn('Session timeout detected');
      store.dispatch({ type: 'auth/logout' });
      store.dispatch({ 
        type: 'ui/addToast', 
        payload: {
          id: Date.now().toString(),
          type: 'info',
          title: 'Session Expired',
          message: 'You have been logged out due to inactivity.',
          duration: 5000
        }
      });
      return;
    }
  }

  return next(action);
};
