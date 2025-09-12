// hooks/useAuth.ts
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, registerUser, logoutUser, clearError } from '../store/slices/authSlice';
import { LoginRequest, RegisterRequest } from '../types/auth';

/**
 * Custom hook for authentication operations
 * Provides a clean interface for auth-related actions and state
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = async (credentials: LoginRequest) => {
    const result = await dispatch(loginUser(credentials));
    return result;
  };

  const register = async (userData: RegisterRequest) => {
    const result = await dispatch(registerUser(userData));
    return result;
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearAuthError,
  };
};
