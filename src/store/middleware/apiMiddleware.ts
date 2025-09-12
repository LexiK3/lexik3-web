// store/middleware/apiMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../../types/store';

export const apiMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: any) => {
  // Track API call metrics
  if (action.type.endsWith('/pending')) {
    const startTime = Date.now();
    action.meta = { ...action.meta, startTime };
  }
  
  if (action.type.endsWith('/fulfilled')) {
    const startTime = action.meta?.startTime;
    if (startTime) {
      const duration = Date.now() - startTime;
      console.log(`API call ${action.type} completed in ${duration}ms`);
    }
  }
  
  // Handle API rate limiting
  if (action.type.endsWith('/rejected') && action.payload?.includes('429')) {
    // Implement exponential backoff for rate limited requests
    const retryAfter = action.meta?.retryAfter || 1000;
    const retryCount = action.meta?.retryCount || 0;
    
    if (retryCount < 3) {
      setTimeout(() => {
        store.dispatch({
          ...action,
          meta: {
            ...action.meta,
            retryCount: retryCount + 1,
            retryAfter: retryAfter * 2
          }
        });
      }, retryAfter);
      return;
    }
  }

  return next(action);
};
