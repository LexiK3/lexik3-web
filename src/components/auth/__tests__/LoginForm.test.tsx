import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginForm from '../LoginForm';
import authSlice from '../../../store/slices/authSlice';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: null }),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      },
    },
  });
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createMockStore();
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

describe('LoginForm', () => {
  it('renders login form with proper styling classes', () => {
    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    // Check if the main card container has proper styling
    const cardElement = screen.getByText('Sign In').closest('.max-w-md.mx-auto');
    expect(cardElement).toBeInTheDocument();

    // Check if the title has proper styling
    const titleElement = screen.getByText('Sign In');
    expect(titleElement).toHaveClass('text-2xl', 'font-bold', 'text-gray-900');

    // Check if the subtitle has proper styling
    const subtitleElement = screen.getByText('Welcome back to LexiK3');
    expect(subtitleElement).toHaveClass('text-gray-600');

    // Check if email input has proper styling
    const emailInput = screen.getByPlaceholderText('Enter your email');
    expect(emailInput).toHaveClass('block', 'w-full', 'pl-10', 'pr-3', 'py-2', 'border', 'rounded-lg');

    // Check if password input has proper styling
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    expect(passwordInput).toHaveClass('block', 'w-full', 'pl-10', 'pr-3', 'py-2', 'border', 'rounded-lg');

    // Check if submit button has proper styling
    const submitButton = screen.getByRole('button', { name: /sign in with email/i });
    expect(submitButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'font-medium', 'rounded-lg');
  });

  it('displays validation errors with proper styling', async () => {
    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /sign in with email/i });
    submitButton.click();

    // Wait for validation errors to appear
    const emailError = await screen.findByText('Email is required');
    expect(emailError).toHaveClass('text-sm', 'text-red-600');

    const passwordError = await screen.findByText('Password is required');
    expect(passwordError).toHaveClass('text-sm', 'text-red-600');
  });

  it('shows loading state with proper styling', () => {
    const store = configureStore({
      reducer: {
        auth: authSlice,
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isLoading: true,
          error: null,
          isAuthenticated: false,
        },
      },
    });

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    // Check if loading button has proper styling
    const loadingButton = screen.getByRole('button', { name: /signing in/i });
    expect(loadingButton).toHaveClass('inline-flex', 'items-center', 'justify-center');
    expect(loadingButton).toBeDisabled();
  });
});
