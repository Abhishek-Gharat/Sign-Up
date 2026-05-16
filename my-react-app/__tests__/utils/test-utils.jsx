// __tests__/utils/test-utils.jsx
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';

// Import reducers
import counterReducer from '../../src/store/counterSlice';
import authReducer from '../../src/store/slices/authSlice';

/**
 * Custom render function that wraps components with Redux Provider and Router
 * @param {ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.preloadedState - Initial state for Redux store
 * @param {Object} options.store - Custom Redux store
 * @returns {Object} Render result with store
 */
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        counter: counterReducer,
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          token: null,
          userId: null,
          email: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          ...(preloadedState.auth || {}),
        },
        counter: {
          value: 0,
          ...(preloadedState.counter || {}),
        },
      },
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

/**
 * Creates a mock function with Jest spy functionality
 * @returns {Function} Mock function
 */
export function createMock() {
  return jest.fn();
}

/**
 * Helper to wait for promises to resolve
 * @returns {Promise} Resolved promise
 */
export function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

// Re-export everything from testing-library
export * from '@testing-library/react';
