// store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Notification, ToastProps, ModalState } from '../../types/store';
import { Theme, LanguageCode, NotificationType } from '../../types/enums';

const initialState: UIState = {
  theme: Theme.Light,
  language: LanguageCode.English,
  sidebarOpen: false,
  notifications: [],
  modals: {},
  toasts: [],
  loading: {
    global: false,
    auth: false,
    books: false,
    learning: false,
    progress: false,
    profile: false,
  },
  errors: {
    global: null,
    auth: null,
    books: null,
    learning: null,
    progress: null,
    network: null,
  },
  preferences: {
    sidebarCollapsed: false,
    compactMode: false,
    showTutorials: true,
    animationsEnabled: true,
    soundEnabled: true,
    autoSave: true,
    autoRefresh: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<LanguageCode>) => {
      state.language = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<{ modalId: string; data?: any }>) => {
      state.modals[action.payload.modalId] = {
        isOpen: true,
        data: action.payload.data,
      };
    },
    closeModal: (state, action: PayloadAction<string>) => {
      if (state.modals[action.payload]) {
        state.modals[action.payload].isOpen = false;
        state.modals[action.payload].data = undefined;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modalId => {
        state.modals[modalId] = {
          isOpen: false,
          data: undefined,
        };
      });
    },
    addToast: (state, action: PayloadAction<Omit<ToastProps, 'id'>>) => {
      const toast: ToastProps = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    setLoading: (state, action: PayloadAction<{ key: keyof typeof state.loading; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    setError: (state, action: PayloadAction<{ key: keyof typeof state.errors; value: string | null }>) => {
      state.errors[action.payload.key] = action.payload.value;
    },
    clearError: (state, action: PayloadAction<keyof typeof state.errors>) => {
      state.errors[action.payload] = null;
    },
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key as keyof typeof state.errors] = null;
      });
    },
    updatePreferences: (state, action: PayloadAction<Partial<typeof state.preferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const {
  setTheme,
  setLanguage,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  clearAllNotifications,
  openModal,
  closeModal,
  closeAllModals,
  addToast,
  removeToast,
  clearAllToasts,
  setLoading,
  setError,
  clearError,
  clearAllErrors,
  updatePreferences,
} = uiSlice.actions;

export default uiSlice.reducer;
