import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import authSlice from './store/slices/authSlice';

// Mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
  });
};

test('renders app with login form', () => {
  const store = createMockStore();
  
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  
  // Check if the login form is rendered (since we're not authenticated)
  const signInButton = screen.getByRole('button', { name: /sign in with email/i });
  expect(signInButton).toBeInTheDocument();
});
