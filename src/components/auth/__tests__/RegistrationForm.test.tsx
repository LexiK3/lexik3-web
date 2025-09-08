import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RegistrationForm from '../RegistrationForm';
import authSlice from '../../../store/slices/authSlice';

// Mock react-router-dom
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock store
const createMockStore = (initialState = {}) => {
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
        ...initialState,
      },
    },
  });
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode; initialState?: any }> = ({ 
  children, 
  initialState = {} 
}) => {
  const store = createMockStore(initialState);
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

describe('RegistrationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form with proper styling classes', () => {
    render(
      <TestWrapper>
        <RegistrationForm />
      </TestWrapper>
    );

    // Check if the main card container has proper styling
    const cardElement = screen.getByRole('generic').querySelector('.max-w-md.mx-auto');
    expect(cardElement).toBeInTheDocument();

    // Check if the title has proper styling
    const titleElement = screen.getByText('Create Account');
    expect(titleElement).toHaveClass('text-2xl', 'font-bold', 'text-gray-900');

    // Check if the subtitle has proper styling
    const subtitleElement = screen.getByText('Join LexiK3 and start your vocabulary journey');
    expect(subtitleElement).toHaveClass('text-gray-600');

    // Check if all form inputs have proper styling
    const firstNameInput = screen.getByPlaceholderText('Enter your first name');
    expect(firstNameInput).toHaveClass('block', 'w-full', 'pl-10', 'pr-3', 'py-2', 'border', 'rounded-lg');

    const lastNameInput = screen.getByPlaceholderText('Enter your last name');
    expect(lastNameInput).toHaveClass('block', 'w-full', 'pl-10', 'pr-3', 'py-2', 'border', 'rounded-lg');

    const emailInput = screen.getByPlaceholderText('Enter your email');
    expect(emailInput).toHaveClass('block', 'w-full', 'pl-10', 'pr-3', 'py-2', 'border', 'rounded-lg');

    const passwordInput = screen.getByPlaceholderText('Create a password');
    expect(passwordInput).toHaveClass('block', 'w-full', 'pl-10', 'pr-3', 'py-2', 'border', 'rounded-lg');

    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    expect(confirmPasswordInput).toHaveClass('block', 'w-full', 'pl-10', 'pr-3', 'py-2', 'border', 'rounded-lg');

    // Check if submit button has proper styling
    const submitButton = screen.getByRole('button', { name: /create account/i });
    expect(submitButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'font-medium', 'rounded-lg');
  });

  it('displays validation errors with proper styling', async () => {
    render(
      <TestWrapper>
        <RegistrationForm />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toHaveClass('text-sm', 'text-red-600');
      expect(screen.getByText('Last name is required')).toHaveClass('text-sm', 'text-red-600');
      expect(screen.getByText('Email is required')).toHaveClass('text-sm', 'text-red-600');
      expect(screen.getByText('Password is required')).toHaveClass('text-sm', 'text-red-600');
      expect(screen.getByText('Confirm password is required')).toHaveClass('text-sm', 'text-red-600');
    });
  });

  it('validates email format with proper error styling', async () => {
    render(
      <TestWrapper>
        <RegistrationForm />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const emailError = screen.getByText('Invalid email address');
      expect(emailError).toHaveClass('text-sm', 'text-red-600');
    });
  });

  it('validates password confirmation with proper error styling', async () => {
    render(
      <TestWrapper>
        <RegistrationForm />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText('Create a password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const confirmPasswordError = screen.getByText('Passwords do not match');
      expect(confirmPasswordError).toHaveClass('text-sm', 'text-red-600');
    });
  });

  it('validates password strength with proper error styling', async () => {
    render(
      <TestWrapper>
        <RegistrationForm />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText('Create a password');
    fireEvent.change(passwordInput, { target: { value: '123' } });
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const passwordError = screen.getByText('Password must be at least 8 characters');
      expect(passwordError).toHaveClass('text-sm', 'text-red-600');
    });
  });

  it('shows loading state with proper styling', () => {
    render(
      <TestWrapper initialState={{ isLoading: true }}>
        <RegistrationForm />
      </TestWrapper>
    );

    // Check if loading button has proper styling
    const loadingButton = screen.getByRole('button', { name: /creating account/i });
    expect(loadingButton).toHaveClass('inline-flex', 'items-center', 'justify-center');
    expect(loadingButton).toBeDisabled();
  });

  it('displays server error with proper styling', () => {
    const errorMessage = 'An account with this email already exists';
    render(
      <TestWrapper initialState={{ error: errorMessage }}>
        <RegistrationForm />
      </TestWrapper>
    );

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toHaveClass('text-sm', 'text-red-600');
    
    // Check if error container has proper styling
    const errorContainer = errorElement.closest('.bg-red-50.border.border-red-200.rounded-lg');
    expect(errorContainer).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    render(
      <TestWrapper>
        <RegistrationForm />
      </TestWrapper>
    );

    // Fill in valid form data
    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), { 
      target: { value: 'Doe' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { 
      target: { value: 'john.doe@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Create a password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { 
      target: { value: 'password123' } 
    });
    
    // Check terms checkbox
    const termsCheckbox = screen.getByRole('checkbox');
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    // Form should submit without validation errors
    await waitFor(() => {
      expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Last name is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Confirm password is required')).not.toBeInTheDocument();
    });
  });

  it('navigates to login page when sign in link is clicked', () => {
    render(
      <TestWrapper>
        <RegistrationForm />
      </TestWrapper>
    );

    const signInLink = screen.getByText('Sign in');
    fireEvent.click(signInLink);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('shows terms and conditions checkbox with proper styling', () => {
    render(
      <TestWrapper>
        <RegistrationForm />
      </TestWrapper>
    );

    const termsCheckbox = screen.getByRole('checkbox');
    expect(termsCheckbox).toBeInTheDocument();
    expect(termsCheckbox).not.toBeChecked();

    const termsLabel = screen.getByText(/I agree to the Terms and Conditions/);
    expect(termsLabel).toHaveClass('text-sm', 'text-gray-600');
  });

  it('validates terms and conditions acceptance', async () => {
    render(
      <TestWrapper>
        <RegistrationForm />
      </TestWrapper>
    );

    // Fill in valid form data but don't check terms
    fireEvent.change(screen.getByPlaceholderText('Enter your first name'), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your last name'), { 
      target: { value: 'Doe' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { 
      target: { value: 'john.doe@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Create a password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { 
      target: { value: 'password123' } 
    });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const termsError = screen.getByText('You must accept the Terms and Conditions');
      expect(termsError).toHaveClass('text-sm', 'text-red-600');
    });
  });
});
