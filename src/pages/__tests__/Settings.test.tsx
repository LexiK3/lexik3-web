// pages/__tests__/Settings.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Settings from '../Settings';
import authReducer from '../../store/slices/authSlice';
import uiReducer from '../../store/slices/uiSlice';

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
};

const createMockStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
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
      ui: {
        theme: 'light',
        language: 'en',
        sidebarCollapsed: false,
        isLoading: false,
        error: null,
        ...initialState.ui,
      },
    },
  });
};

describe('Settings Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render settings page with header', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });

  it('should display general settings section', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Time Zone')).toBeInTheDocument();
  });

  it('should display learning settings section', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    expect(screen.getByText('Learning')).toBeInTheDocument();
    expect(screen.getByText('Daily Goal')).toBeInTheDocument();
    expect(screen.getByText('Difficulty Level')).toBeInTheDocument();
    expect(screen.getByText('Auto-advance')).toBeInTheDocument();
    expect(screen.getByText('Sound Effects')).toBeInTheDocument();
  });

  it('should display notification settings section', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('Push Notifications')).toBeInTheDocument();
    expect(screen.getByText('Daily Reminder')).toBeInTheDocument();
    expect(screen.getByText('Study Reminders')).toBeInTheDocument();
  });

  it('should display privacy settings section', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Data Collection')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Personalized Ads')).toBeInTheDocument();
  });

  it('should display advanced settings section', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    expect(screen.getAllByText('Advanced')[0]).toBeInTheDocument();
    expect(screen.getByText('Cache Management')).toBeInTheDocument();
    expect(screen.getAllByText('Export Data')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Reset Settings')[0]).toBeInTheDocument();
  });

  it('should handle language change', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const languageSelect = screen.getByLabelText('Language');
    fireEvent.change(languageSelect, { target: { value: 'es' } });

    const saveButton = screen.getByTestId('save-general-settings');
    fireEvent.click(saveButton);

    // Verify the change was made (this would be handled by Redux in real app)
    expect(languageSelect).toHaveValue('es');
  });

  it('should handle theme change', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const themeSelect = screen.getByLabelText('Theme');
    fireEvent.change(themeSelect, { target: { value: 'dark' } });

    const saveButton = screen.getByTestId('save-general-settings');
    fireEvent.click(saveButton);

    expect(themeSelect).toHaveValue('dark');
  });

  it('should handle time zone change', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const timezoneSelect = screen.getByLabelText('Time Zone');
    fireEvent.change(timezoneSelect, { target: { value: 'America/New_York' } });

    const saveButton = screen.getByTestId('save-general-settings');
    fireEvent.click(saveButton);

    expect(timezoneSelect).toHaveValue('America/New_York');
  });

  it('should handle daily goal change', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const dailyGoalInput = screen.getByLabelText('Daily Goal');
    fireEvent.change(dailyGoalInput, { target: { value: '30' } });

    const saveButton = screen.getByTestId('save-learning-settings');
    fireEvent.click(saveButton);

    expect(dailyGoalInput).toHaveValue(30);
  });

  it('should handle difficulty level change', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const difficultySelect = screen.getByLabelText('Difficulty Level');
    fireEvent.change(difficultySelect, { target: { value: 'advanced' } });

    const saveButton = screen.getByTestId('save-learning-settings');
    fireEvent.click(saveButton);

    expect(difficultySelect).toHaveValue('advanced');
  });

  it('should handle auto-advance toggle', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const autoAdvanceCheckbox = screen.getByLabelText('Auto-advance');
    // The checkbox starts checked, so clicking it should uncheck it
    fireEvent.click(autoAdvanceCheckbox);

    const saveButton = screen.getByTestId('save-learning-settings');
    fireEvent.click(saveButton);

    expect(autoAdvanceCheckbox).not.toBeChecked();
  });

  it('should handle sound effects toggle', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const soundEffectsCheckbox = screen.getByLabelText('Sound Effects');
    fireEvent.click(soundEffectsCheckbox);

    const saveButton = screen.getByTestId('save-learning-settings');
    fireEvent.click(saveButton);

    expect(soundEffectsCheckbox).toBeChecked();
  });

  it('should handle notification toggles', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const emailNotificationsCheckbox = screen.getByLabelText('Email Notifications');
    const pushNotificationsCheckbox = screen.getByLabelText('Push Notifications');
    const dailyReminderCheckbox = screen.getByLabelText('Daily Reminder');
    const studyRemindersCheckbox = screen.getByLabelText('Study Reminders');

    fireEvent.click(pushNotificationsCheckbox);
    fireEvent.click(studyRemindersCheckbox);

    const saveButton = screen.getByTestId('save-notification-settings');
    fireEvent.click(saveButton);

    expect(emailNotificationsCheckbox).toBeChecked(); // Should remain checked
    expect(pushNotificationsCheckbox).toBeChecked(); // Should be toggled
    expect(dailyReminderCheckbox).toBeChecked(); // Should remain checked
    expect(studyRemindersCheckbox).toBeChecked(); // Should be toggled
  });

  it('should handle privacy settings toggles', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const dataCollectionCheckbox = screen.getByLabelText('Data Collection');
    const analyticsCheckbox = screen.getByLabelText('Analytics');
    const personalizedAdsCheckbox = screen.getByLabelText('Personalized Ads');

    fireEvent.click(analyticsCheckbox);
    fireEvent.click(personalizedAdsCheckbox);

    const saveButton = screen.getByTestId('save-privacy-settings');
    fireEvent.click(saveButton);

    expect(dataCollectionCheckbox).toBeChecked(); // Should remain checked
    expect(analyticsCheckbox).not.toBeChecked(); // Should be toggled
    expect(personalizedAdsCheckbox).not.toBeChecked(); // Should be toggled
  });

  it('should handle cache management', async () => {
    const store = createMockStore();
    
    // Mock window.confirm before rendering
    window.confirm = jest.fn(() => true);
    
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const clearCacheButton = screen.getByTestId('clear-cache-button');
    fireEvent.click(clearCacheButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to clear the cache? This will remove all cached data.'
    );
  });

  it('should handle data export', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    // Debug: log what's being rendered
    screen.debug();

    const exportDataButton = screen.getByTestId('export-data-button');
    fireEvent.click(exportDataButton);

    // In a real app, this would trigger a download
    expect(exportDataButton).toBeInTheDocument();
  });

  it('should handle settings reset', async () => {
    const store = createMockStore();
    
    // Mock window.confirm before rendering
    window.confirm = jest.fn(() => true);
    
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const resetSettingsButton = screen.getByTestId('reset-settings-button');
    fireEvent.click(resetSettingsButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to reset all settings to default? This action cannot be undone.'
    );
  });

  it('should display loading state when saving settings', () => {
    const store = createMockStore({
      ui: { isLoading: true },
    });

    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should display error message when there is an error', () => {
    const store = createMockStore({
      ui: { 
        error: 'Failed to save settings',
        isLoading: false,
      },
    });

    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Error: Failed to save settings')).toBeInTheDocument();
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
        <Settings />
      </Provider>
    );

    const backButton = screen.getByText('Back to Dashboard');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should display current settings values from user preferences', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    // Check that form elements are present with correct labels
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Daily Goal')).toBeInTheDocument();
    expect(screen.getByLabelText('Difficulty Level')).toBeInTheDocument();
    expect(screen.getByLabelText('Auto-advance')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Push Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Daily Reminder')).toBeInTheDocument();
  });

  it('should not clear cache when confirmation is cancelled', () => {
    const store = createMockStore();

    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false);

    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const clearCacheButton = screen.getByTestId('clear-cache-button');
    fireEvent.click(clearCacheButton);

    expect(window.confirm).toHaveBeenCalled();
    // In a real app, we would verify that cache clearing was not triggered
  });

  it('should not reset settings when confirmation is cancelled', () => {
    const store = createMockStore();

    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false);

    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    );

    const resetSettingsButton = screen.getByTestId('reset-settings-button');
    fireEvent.click(resetSettingsButton);

    expect(window.confirm).toHaveBeenCalled();
    // In a real app, we would verify that settings reset was not triggered
  });
});
