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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  
  // Check if the login form is rendered (since we're not authenticated)
  const signInElement = screen.getByText(/sign in/i);
  expect(signInElement).toBeInTheDocument();
});
