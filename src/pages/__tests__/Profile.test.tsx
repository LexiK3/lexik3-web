// pages/__tests__/Profile.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Profile from '../Profile';
import authReducer from '../../store/slices/authSlice';
import userReducer from '../../store/slices/userSlice';

// Mock the user service
jest.mock('../../services/user/userService', () => ({
  UserService: {
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    deleteAccount: jest.fn(),
    uploadAvatar: jest.fn(),
  },
}));

// Mock the common components
jest.mock('../../components/common/Card', () => {
  return function MockCard({ children, className }: any) {
    return <div className={className} data-testid="card">{children}</div>;
  };
});

jest.mock('../../components/common/Button', () => {
  return function MockButton({ children, onClick, variant, size, disabled, ...props }: any) {
    return (
      <button 
        onClick={onClick} 
        data-variant={variant}
        data-size={size}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  };
});

jest.mock('../../components/common/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

jest.mock('../../components/common/ErrorMessage', () => {
  return function MockErrorMessage({ error, onRetry, onDismiss, className }: any) {
    return (
      <div className={className} data-testid="error-message">
        <div>Error: {error}</div>
        <button onClick={onRetry}>Retry</button>
        <button onClick={onDismiss}>Dismiss</button>
      </div>
    );
  };
});

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: null,
  dateJoined: '2024-01-01T00:00:00Z',
  lastLogin: '2024-01-15T10:00:00Z',
  preferences: {
    language: 'en',
    theme: 'light',
    notifications: {
      email: true,
      push: false,
      dailyReminder: true,
    },
    learning: {
      dailyGoal: 20,
      difficulty: 'intermediate',
      autoAdvance: true,
    },
  },
  statistics: {
    totalStudyTime: 120,
    wordsLearned: 150,
    currentStreak: 5,
    longestStreak: 15,
  },
};

const createMockStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
    },
    preloadedState: {
      auth: {
        user: mockUser,
        token: 'token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        ...initialState.auth,
      },
      user: {
        profile: mockUser,
        isLoading: false,
        error: null,
        ...initialState.user,
      },
    },
  });
};

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render profile page with header', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });

  it('should display user information correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Member since January 1, 2024')).toBeInTheDocument();
    expect(screen.getByText('Last login: January 15, 2024')).toBeInTheDocument();
  });

  it('should display user statistics', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument(); // Total study time
    expect(screen.getByText('Total Study Time (min)')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument(); // Words learned
    expect(screen.getByText('Words Learned')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Current streak
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument(); // Longest streak
    expect(screen.getByText('Longest Streak')).toBeInTheDocument();
  });

  it('should display profile form with current user data', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('should display preferences form', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Daily Goal (words)')).toBeInTheDocument();
    expect(screen.getByLabelText('Difficulty')).toBeInTheDocument();
  });

  it('should display notification preferences', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Email notifications')).toBeChecked();
    expect(screen.getByLabelText('Push notifications')).not.toBeChecked();
    expect(screen.getByLabelText('Daily reminder')).toBeChecked();
  });

  it('should handle form submission for profile update', async () => {
    const store = createMockStore();
    const { UserService } = require('../../services/user/userService');
    UserService.updateProfile.mockResolvedValueOnce({ success: true });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

    const saveButton = screen.getByTestId('save-profile-changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(UserService.updateProfile).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'test@example.com',
        preferences: {
          language: 'en',
          theme: 'light',
          learning: {
            dailyGoal: 20,
            difficulty: 'intermediate',
            autoAdvance: true,
          },
          notifications: {
            email: true,
            push: false,
            dailyReminder: true,
          },
        },
      });
    });
  });

  it('should handle password change', async () => {
    const store = createMockStore();
    const { UserService } = require('../../services/user/userService');
    UserService.changePassword.mockResolvedValueOnce({ success: true });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const currentPasswordInput = screen.getByLabelText('Current Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword' } });

    const changePasswordButton = screen.getByTestId('change-password-button');
    fireEvent.click(changePasswordButton);

    await waitFor(() => {
      expect(UserService.changePassword).toHaveBeenCalledWith({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
      });
    });
  });

  it('should validate password confirmation', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

    fireEvent.change(newPasswordInput, { target: { value: 'newpassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });

    const changePasswordButton = screen.getByTestId('change-password-button');
    fireEvent.click(changePasswordButton);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('should handle avatar upload', async () => {
    const store = createMockStore();
    const { UserService } = require('../../services/user/userService');
    UserService.uploadAvatar.mockResolvedValueOnce({ 
      success: true, 
      avatarUrl: 'https://example.com/avatar.jpg' 
    });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const fileInput = screen.getByLabelText('Upload Avatar');
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(UserService.uploadAvatar).toHaveBeenCalledWith(file);
    });
  });

  it('should display loading state when updating profile', () => {
    const store = createMockStore({
      user: { isLoading: true },
    });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should display error message when there is an error', () => {
    const store = createMockStore({
      user: { 
        error: 'Failed to update profile',
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Error: Failed to update profile')).toBeInTheDocument();
  });

  it('should handle account deletion confirmation', async () => {
    const store = createMockStore();
    const { UserService } = require('../../services/user/userService');
    UserService.deleteAccount.mockResolvedValueOnce({ success: true });

    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const deleteButton = screen.getByTestId('delete-account-button');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    await waitFor(() => {
      expect(UserService.deleteAccount).toHaveBeenCalled();
    });
  });

  it('should not delete account when confirmation is cancelled', () => {
    const store = createMockStore();
    const { UserService } = require('../../services/user/userService');

    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false);

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const deleteButton = screen.getByTestId('delete-account-button');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(UserService.deleteAccount).not.toHaveBeenCalled();
  });

  it('should handle back button click', () => {
    const store = createMockStore();
    
    // Mock window.history.back
    const mockBack = jest.fn();
    Object.defineProperty(window, 'history', {
      value: { back: mockBack },
      writable: true,
    });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const backButton = screen.getByText('Back to Dashboard');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should display default avatar when user has no avatar', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    // Should show default avatar placeholder
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('should display user avatar when available', () => {
    const userWithAvatar = {
      ...mockUser,
      avatar: 'https://example.com/avatar.jpg',
    };

    const store = createMockStore({
      auth: { user: userWithAvatar },
      user: { profile: userWithAvatar },
    });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const avatarImage = screen.getByAltText('User Avatar');
    expect(avatarImage).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should handle preference changes', async () => {
    const store = createMockStore();
    const { UserService } = require('../../services/user/userService');
    UserService.updateProfile.mockResolvedValueOnce({ success: true });

    render(
      <Provider store={store}>
        <Profile />
      </Provider>
    );

    const languageSelect = screen.getByLabelText('Language');
    fireEvent.change(languageSelect, { target: { value: 'es' } });

    const themeSelect = screen.getByLabelText('Theme');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });

    const dailyGoalInput = screen.getByLabelText('Daily Goal (words)');
    fireEvent.change(dailyGoalInput, { target: { value: '30' } });

    const saveButton = screen.getByTestId('save-preferences-changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(UserService.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          preferences: expect.objectContaining({
            language: 'es',
            theme: 'dark',
            learning: expect.objectContaining({
              dailyGoal: 30,
            }),
          }),
        })
      );
    });
  });
});
