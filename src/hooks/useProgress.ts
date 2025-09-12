// hooks/useProgress.ts
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserProgress, clearError } from '../store/slices/progressSlice';

/**
 * Custom hook for progress operations
 * Provides a clean interface for progress-related actions and state
 */
export const useProgress = () => {
  const dispatch = useAppDispatch();
  const { 
    userProgress, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.progress);

  const loadProgress = async (params?: any) => {
    const result = await dispatch(fetchUserProgress(params || {}));
    return result;
  };

  const clearProgressError = () => {
    dispatch(clearError());
  };

  return {
    userProgress,
    isLoading,
    error,
    loadProgress,
    clearProgressError,
  };
};
