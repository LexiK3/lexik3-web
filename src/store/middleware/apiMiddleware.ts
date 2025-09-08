// store/middleware/apiMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../../types/store';

export const apiMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: any) => {
  // Handle API errors globally
  if (action.type.endsWith('/rejected')) {
    const error = action.payload;
    
    // Handle specific error types
    if (error.includes('401') || error.includes('Unauthorized')) {
      // Token expired, redirect to login
      store.dispatch({ type: 'auth/clearAuth' });
      window.location.href = '/login';
    }
    
    if (error.includes('403') || error.includes('Forbidden')) {
      // Insufficient permissions
      console.warn('Access forbidden:', action.type);
    }

    // Show error toast
    store.dispatch({
      type: 'ui/addToast',
      payload: {
        type: 'error',
        title: 'Error',
        message: error,
        duration: 5000,
      },
    });
  }

  return next(action);
};
