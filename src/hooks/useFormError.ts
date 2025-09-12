// hooks/useFormError.ts
import { useState, useCallback } from 'react';

/**
 * Custom hook for form error handling
 * Provides a clean interface for managing form errors and validation
 */
export const useFormError = () => {
  const [localError, setLocalError] = useState<string>('');

  const setError = useCallback((error: string) => {
    setLocalError(error);
  }, []);

  const clearError = useCallback(() => {
    setLocalError('');
  }, []);

  const getDisplayError = useCallback((globalError?: string | null) => {
    return localError || globalError || null;
  }, [localError]);

  return {
    localError,
    setError,
    clearError,
    getDisplayError,
  };
};
