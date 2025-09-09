// pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateSettings, clearCache, exportData, resetSettings } from '../store/slices/uiSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme, language, isLoading, error } = useAppSelector((state) => state.ui);

  const [generalSettings, setGeneralSettings] = useState({
    language: 'en',
    theme: 'light',
    timezone: 'UTC',
  });

  const [learningSettings, setLearningSettings] = useState({
    dailyGoal: 20,
    difficulty: 'intermediate',
    autoAdvance: true,
    soundEffects: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dailyReminder: true,
    studyReminders: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    analytics: true,
    personalizedAds: true,
  });

  useEffect(() => {
    if (user?.preferences) {
      setGeneralSettings({
        language: user.preferences.language || 'en',
        theme: user.preferences.theme || 'light',
        timezone: 'UTC', // Default timezone
      });

      setLearningSettings({
        dailyGoal: user.preferences.learning?.wordsPerSession || 20,
        difficulty: user.preferences.learning?.difficultyPreference || 'intermediate',
        autoAdvance: user.preferences.learning?.autoAdvance || true,
        soundEffects: user.preferences.learning?.soundEnabled || false,
      });

      setNotificationSettings({
        emailNotifications: user.preferences.notifications?.email || true,
        pushNotifications: user.preferences.notifications?.push || false,
        dailyReminder: user.preferences.notifications?.reminders || true,
        studyReminders: false, // Default value
      });
    } else {
      // Set default values even if no user preferences
      setGeneralSettings({
        language: 'en',
        theme: 'light',
        timezone: 'UTC',
      });

      setLearningSettings({
        dailyGoal: 20,
        difficulty: 'intermediate',
        autoAdvance: true,
        soundEffects: false,
      });

      setNotificationSettings({
        emailNotifications: true,
        pushNotifications: false,
        dailyReminder: true,
        studyReminders: false,
      });
    }
  }, [user]);

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleLearningSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setLearningSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handlePrivacySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSettings({ 
      type: 'general',
      settings: generalSettings 
    }));
  };

  const handleSaveLearningSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSettings({ 
      type: 'learning',
      settings: learningSettings 
    }));
  };

  const handleSaveNotificationSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSettings({ 
      type: 'notifications',
      settings: notificationSettings 
    }));
  };

  const handleSavePrivacySettings = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSettings({ 
      type: 'privacy',
      settings: privacySettings 
    }));
  };

  const handleClearCache = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear the cache? This will remove all cached data.'
    );
    
    if (confirmed) {
      dispatch(clearCache());
    }
  };

  const handleExportData = () => {
    dispatch(exportData());
  };

  const handleResetSettings = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all settings to default? This action cannot be undone.'
    );
    
    if (confirmed) {
      dispatch(resetSettings());
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <ErrorMessage
            error={error}
            onRetry={() => window.location.reload()}
            onDismiss={() => {}}
            className="mb-6"
          />
        )}

        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General</h2>
            <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={generalSettings.language}
                    onChange={handleGeneralSettingsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={generalSettings.theme}
                    onChange={handleGeneralSettingsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Zone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={generalSettings.timezone}
                    onChange={handleGeneralSettingsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} data-testid="save-general-settings">
                Save General Settings
              </Button>
            </form>
          </Card>

          {/* Learning Settings */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning</h2>
            <form onSubmit={handleSaveLearningSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dailyGoal" className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Goal
                  </label>
                  <input
                    id="dailyGoal"
                    type="number"
                    name="dailyGoal"
                    value={learningSettings.dailyGoal}
                    onChange={handleLearningSettingsChange}
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Words per day</p>
                </div>
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={learningSettings.difficulty}
                    onChange={handleLearningSettingsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="autoAdvance"
                    type="checkbox"
                    name="autoAdvance"
                    checked={learningSettings.autoAdvance}
                    onChange={handleLearningSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoAdvance" className="ml-2 block text-sm text-gray-700">
                    Auto-advance
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="soundEffects"
                    type="checkbox"
                    name="soundEffects"
                    checked={learningSettings.soundEffects}
                    onChange={handleLearningSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="soundEffects" className="ml-2 block text-sm text-gray-700">
                    Sound Effects
                  </label>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} data-testid="save-learning-settings">
                Save Learning Settings
              </Button>
            </form>
          </Card>

          {/* Notification Settings */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
            <form onSubmit={handleSaveNotificationSettings} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    name="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="pushNotifications"
                    type="checkbox"
                    name="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onChange={handleNotificationSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700">
                    Push Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="dailyReminder"
                    type="checkbox"
                    name="dailyReminder"
                    checked={notificationSettings.dailyReminder}
                    onChange={handleNotificationSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="dailyReminder" className="ml-2 block text-sm text-gray-700">
                    Daily Reminder
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="studyReminders"
                    type="checkbox"
                    name="studyReminders"
                    checked={notificationSettings.studyReminders}
                    onChange={handleNotificationSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="studyReminders" className="ml-2 block text-sm text-gray-700">
                    Study Reminders
                  </label>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} data-testid="save-notification-settings">
                Save Notification Settings
              </Button>
            </form>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h2>
            <form onSubmit={handleSavePrivacySettings} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="dataCollection"
                    type="checkbox"
                    name="dataCollection"
                    checked={privacySettings.dataCollection}
                    onChange={handlePrivacySettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="dataCollection" className="ml-2 block text-sm text-gray-700">
                    Data Collection
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="analytics"
                    type="checkbox"
                    name="analytics"
                    checked={privacySettings.analytics}
                    onChange={handlePrivacySettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="analytics" className="ml-2 block text-sm text-gray-700">
                    Analytics
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="personalizedAds"
                    type="checkbox"
                    name="personalizedAds"
                    checked={privacySettings.personalizedAds}
                    onChange={handlePrivacySettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="personalizedAds" className="ml-2 block text-sm text-gray-700">
                    Personalized Ads
                  </label>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} data-testid="save-privacy-settings">
                Save Privacy Settings
              </Button>
            </form>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Cache Management</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Clear cached data to free up storage space and resolve potential issues.
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearCache}
                  data-testid="clear-cache-button"
                >
                  Clear Cache
                </Button>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Export Data</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Download a copy of your learning data and progress.
                </p>
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  data-testid="export-data-button"
                >
                  Export Data
                </Button>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Reset Settings</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Reset all settings to their default values.
                </p>
                <Button
                  variant="outline"
                  onClick={handleResetSettings}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  data-testid="reset-settings-button"
                >
                  Reset Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
