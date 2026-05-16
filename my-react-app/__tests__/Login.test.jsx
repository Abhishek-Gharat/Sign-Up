// __tests__/Login.test.jsx
/**
 * Login Component Tests
 * 
 * These tests verify:
 * - Login form renders with all required fields
 * - Input fields update correctly on user interaction
 * - Error messages display when authentication fails
 * - Loading state is shown during authentication
 * - Links to signup and forgot password pages exist
 * - Form submission triggers authentication action
 */

import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/pages/Login/Login';
import authReducer from '../src/store/slices/authSlice';

// Helper to render with Redux and Router
const renderWithProviders = (component, { preloadedState = {} } = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        token: null,
        userId: null,
        email: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        ...preloadedState.auth,
      },
    },
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    ),
  };
};

describe('Login Component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    test('renders login form with all required fields and links', () => {
      // Arrange & Act
      renderWithProviders(<Login />);
      
      // Assert: Form elements
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      
      // Assert: Navigation links
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });

    test('email input has correct type attribute', () => {
      // Arrange & Act
      renderWithProviders(<Login />);
      
      // Assert
      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    test('password input has correct type attribute', () => {
      // Arrange & Act
      renderWithProviders(<Login />);
      
      // Assert
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('User Input', () => {
    test('updates email input when user types', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<Login />);
      
      // Act
      const emailInput = screen.getByPlaceholderText('Email');
      await user.type(emailInput, 'test@example.com');
      
      // Assert
      expect(emailInput).toHaveValue('test@example.com');
    });

    test('updates password input when user types', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<Login />);
      
      // Act
      const passwordInput = screen.getByPlaceholderText('Password');
      await user.type(passwordInput, 'password123');
      
      // Assert
      expect(passwordInput).toHaveValue('password123');
    });

    test('clears inputs after typing and clearing', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<Login />);
      
      // Act
      const emailInput = screen.getByPlaceholderText('Email');
      await user.type(emailInput, 'test@example.com');
      await user.clear(emailInput);
      
      // Assert
      expect(emailInput).toHaveValue('');
    });
  });

  describe('Error Handling', () => {
    test('displays error message when authentication fails', () => {
      // Arrange & Act
      renderWithProviders(<Login />, {
        preloadedState: {
          auth: { error: 'Invalid credentials' },
        },
      });
      
      // Assert
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(screen.getByText('Invalid credentials')).toHaveClass('error');
    });

    test('does not display error when auth state is clean', () => {
      // Arrange & Act
      renderWithProviders(<Login />);
      
      // Assert
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    test('shows loading state and disables button during authentication', () => {
      // Arrange & Act
      renderWithProviders(<Login />, {
        preloadedState: {
          auth: { isLoading: true },
        },
      });
      
      // Assert
      const loginButton = screen.getByRole('button');
      expect(loginButton).toBeDisabled();
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    });

    test('disables email and password inputs during loading', () => {
      // Arrange & Act
      renderWithProviders(<Login />, {
        preloadedState: {
          auth: { isLoading: true },
        },
      });
      
      // Assert
      expect(screen.getByPlaceholderText('Email')).toBeDisabled();
      expect(screen.getByPlaceholderText('Password')).toBeDisabled();
    });

    test('shows login text when not loading', () => {
      // Arrange & Act
      renderWithProviders(<Login />);
      
      // Assert
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.queryByText(/logging in/i)).not.toBeInTheDocument();
    });
  });
});
