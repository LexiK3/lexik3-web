// hooks/__tests__/useFormError.test.ts
import { renderHook, act } from '@testing-library/react';
import { useFormError } from '../useFormError';

describe('useFormError', () => {
  it('should return error state and methods', () => {
    const { result } = renderHook(() => useFormError());

    expect(result.current).toHaveProperty('localError');
    expect(result.current).toHaveProperty('setError');
    expect(result.current).toHaveProperty('clearError');
    expect(result.current).toHaveProperty('getDisplayError');
  });

  it('should have correct initial values', () => {
    const { result } = renderHook(() => useFormError());

    expect(result.current.localError).toBe('');
  });

  it('should set error correctly', () => {
    const { result } = renderHook(() => useFormError());

    act(() => {
      result.current.setError('Test error');
    });

    expect(result.current.localError).toBe('Test error');
  });

  it('should clear error correctly', () => {
    const { result } = renderHook(() => useFormError());

    act(() => {
      result.current.setError('Test error');
    });

    expect(result.current.localError).toBe('Test error');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.localError).toBe('');
  });

  it('should get display error correctly', () => {
    const { result } = renderHook(() => useFormError());

    // Test with no errors
    expect(result.current.getDisplayError()).toBeNull();
    expect(result.current.getDisplayError(null)).toBeNull();

    // Test with local error
    act(() => {
      result.current.setError('Local error');
    });

    expect(result.current.getDisplayError()).toBe('Local error');
    expect(result.current.getDisplayError('Global error')).toBe('Local error');

    // Test with global error only
    act(() => {
      result.current.clearError();
    });

    expect(result.current.getDisplayError('Global error')).toBe('Global error');
  });
});
