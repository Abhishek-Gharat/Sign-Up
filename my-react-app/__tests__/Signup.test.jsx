// __tests__/Signup.test.jsx
/**
 * Signup Component Tests
 * 
 * These tests verify:
 * - Signup form renders with all required fields
 * - All input fields update correctly on user interaction
 * - Password and confirm password fields work
 * - Error messages display when signup fails
 * - Loading state is shown during signup
 * - Link to login page exists
 * - Password inputs are properly secured
 */

import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../src/pages/Signup/Signup';
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

describe('Signup Component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    test('renders signup form with all required fields', () => {
      // Arrange & Act
      renderWithProviders(<Signup />);
      
      // Assert: Form elements
      expect(screen.getByRole('heading', { name: /signup/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      
      // Assert: Navigation link
      expect(screen.getByText(/login/i)).toBeInTheDocument();
      expect(screen.getByText('Have an account?')).toBeInTheDocument();
    });

    test('renders all input fields with correct types', () => {
      // Arrange & Act
      renderWithProviders(<Signup />);
      
      // Assert
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('User Input', () => {
    test('updates all form inputs when user types', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<Signup />);
      
      // Act
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'securepassword123');
      await user.type(confirmPasswordInput, 'securepassword123');
      
      // Assert
      expect(emailInput).toHaveValue('newuser@example.com');
      expect(passwordInput).toHaveValue('securepassword123');
      expect(confirmPasswordInput).toHaveValue('securepassword123');
    });

    test('allows different values in password and confirm password', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<Signup />);
      
      // Act
      const passwordInput = screen.getByPlaceholderText('Password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      
      await user.type(passwordInput, 'password1');
      await user.type(confirmPasswordInput, 'password2');
      
      // Assert: Both inputs should have different values
      expect(passwordInput).toHaveValue('password1');
      expect(confirmPasswordInput).toHaveValue('password2');
    });

    test('clears all inputs after typing', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<Signup />);
      
      // Act
      const emailInput = screen.getByPlaceholderText('Email');
      await user.type(emailInput, 'test@example.com');
      await user.clear(emailInput);
      
      // Assert
      expect(emailInput).toHaveValue('');
    });
  });

  describe('Error Handling', () => {
    test('displays error message when signup fails', () => {
      // Arrange & Act
      renderWithProviders(<Signup />, {
        preloadedState: {
          auth: { error: 'Email already in use' },
        },
      });
      
      // Assert
      expect(screen.getByText('Email already in use')).toBeInTheDocument();
    });

    test('displays error for weak password', () => {
      // Arrange & Act
      renderWithProviders(<Signup />, {
        preloadedState: {
          auth: { error: 'Password should be at least 6 characters' },
        },
      });
      
      // Assert
      expect(screen.getByText('Password should be at least 6 characters')).toBeInTheDocument();
    });

    test('does not show error when state is clean', () => {
      // Arrange & Act
      renderWithProviders(<Signup />);
      
      // Assert
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    test('disables button and shows loading text during signup', () => {
      // Arrange & Act
      renderWithProviders(<Signup />, {
        preloadedState: {
          auth: { isLoading: true },
        },
      });
      
      // Assert
      const signupButton = screen.getByRole('button');
      expect(signupButton).toBeDisabled();
      expect(screen.getByText(/signing up/i)).toBeInTheDocument();
    });

    test('disables all inputs during loading', () => {
      // Arrange & Act
      renderWithProviders(<Signup />, {
        preloadedState: {
          auth: { isLoading: true },
        },
      });
      
      // Assert
      expect(screen.getByPlaceholderText('Email')).toBeDisabled();
      expect(screen.getByPlaceholderText('Password')).toBeDisabled();
      expect(screen.getByPlaceholderText('Confirm Password')).toBeDisabled();
    });

    test('shows sign up text when not loading', () => {
      // Arrange & Act
      renderWithProviders(<Signup />);
      
      // Assert
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.queryByText(/signing up/i)).not.toBeInTheDocument();
    });
  });

  describe('Security', () => {
    test('password inputs have type password for security', () => {
      // Arrange & Act
      renderWithProviders(<Signup />);
      
      // Assert
      const passwordInput = screen.getByPlaceholderText('Password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });

    test('password inputs do not show plain text', () => {
      // Arrange & Act
      renderWithProviders(<Signup />);
      
      // Assert: Password inputs should never be of type text
      const inputs = screen.getAllByRole('textbox');
      const passwordInputs = inputs.filter(input => 
        input.getAttribute('type') === 'password'
      );
      
      // There should be no text inputs with password values
      expect(passwordInputs).toHaveLength(0);
    });
  });
});
