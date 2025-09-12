// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';
import learningReducer from './slices/learningSlice';
import progressReducer from './slices/progressSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';

// Import middleware
import { authMiddleware } from './middleware/authMiddleware';
import { apiMiddleware } from './middleware/apiMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and UI state
  blacklist: ['learning'], // Don't persist learning sessions
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  books: booksReducer,
  learning: learningReducer,
  progress: progressReducer,
  ui: uiReducer,
  user: userReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    .concat(authMiddleware)
    .concat(apiMiddleware)
    .concat(errorMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Type definitions
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export { useAppDispatch, useAppSelector } from './hooks';
