// store/middleware/errorMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../../types/store';
import { ErrorHandler } from '../../services/error/ErrorHandler';

export const errorMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: any) => {
  // Handle rejected async thunks
  if (action.type.endsWith('/rejected')) {
    const error = action.payload;
    const errorMessage = ErrorHandler.handleApiError(error);
    
    // Log error for debugging
    ErrorHandler.logError(error, `Redux Action: ${action.type}`);
    
    // Handle specific error types
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      // Token expired, clear auth and redirect
      store.dispatch({ type: 'auth/clearAuth' });
      store.dispatch({ 
        type: 'ui/addToast', 
        payload: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Session Expired',
          message: 'Your session has expired. Please log in again.',
          duration: 5000
        }
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    
    if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
      // Insufficient permissions
      store.dispatch({ 
        type: 'ui/addToast', 
        payload: {
          id: Date.now().toString(),
          type: 'warning',
          title: 'Access Denied',
          message: 'You do not have permission to perform this action.',
          duration: 5000
        }
      });
      return;
    }
    
    if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests')) {
      // Rate limiting
      store.dispatch({ 
        type: 'ui/addToast', 
        payload: {
          id: Date.now().toString(),
          type: 'warning',
          title: 'Rate Limited',
          message: 'Too many requests. Please wait a moment before trying again.',
          duration: 5000
        }
      });
      return;
    }
    
    if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
      // Server error
      store.dispatch({ 
        type: 'ui/addToast', 
        payload: {
          id: Date.now().toString(),
          type: 'error',
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again later.',
          duration: 5000
        }
      });
      return;
    }
    
    // Generic error handling
    store.dispatch({ 
      type: 'ui/addToast', 
      payload: {
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: errorMessage,
        duration: 5000
      }
    });
  }
  
  // Handle network errors
  if (action.type.endsWith('/rejected') && action.error?.message?.includes('Network Error')) {
    store.dispatch({ 
      type: 'ui/addToast', 
      payload: {
        id: Date.now().toString(),
        type: 'error',
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
        duration: 5000
      }
    });
  }

  return next(action);
};
