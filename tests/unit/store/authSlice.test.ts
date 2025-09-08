// tests/unit/store/authSlice.test.ts
import authReducer, { loginUser, registerUser, logoutUser, clearError } from '../../../src/store/slices/authSlice';
import { AuthState } from '../../../src/types/store';

describe('Auth Slice', () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    lastActivity: null,
    loginAttempts: 0,
    isRefreshing: false,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = authReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loginUser.fulfilled', () => {
    const mockAuthResponse = {
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student' as any,
        isEmailVerified: true,
        preferences: {} as any,
        createdAt: '2024-01-01T00:00:00Z',
      },
      expiresAt: '2024-01-02T00:00:00Z',
    };

    const action = { 
      type: loginUser.fulfilled.type, 
      payload: mockAuthResponse 
    };
    const state = authReducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockAuthResponse.user);
    expect(state.token).toBe(mockAuthResponse.token);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loginAttempts).toBe(0);
  });

  it('should handle loginUser.rejected', () => {
    const action = { 
      type: loginUser.rejected.type, 
      payload: 'Login failed' 
    };
    const state = authReducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Login failed');
    expect(state.loginAttempts).toBe(1);
  });

  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const action = { type: clearError.type };
    const state = authReducer(stateWithError, action);
    
    expect(state.error).toBeNull();
  });

  it('should handle updateLastActivity', () => {
    const action = { type: 'auth/updateLastActivity' };
    const state = authReducer(initialState, action);
    
    expect(state.lastActivity).toBeDefined();
  });
});
