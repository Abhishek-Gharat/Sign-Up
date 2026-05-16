// __tests__/Signup.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../src/pages/Signup/Signup';
import authReducer from '../src/store/slices/authSlice';

// Helper function to render with Redux and Router
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
    ...render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    ),
    store,
  };
};

// Test Suite for Signup Component
describe('Signup Component', () => {
  // Test Case 6: Renders signup form with all fields
  test('renders signup form with all input fields', () => {
    renderWithProviders(<Signup />);
    
    // Check if heading is rendered
    expect(screen.getByRole('heading', { name: /signup/i })).toBeInTheDocument();
    
    // Check if email input exists
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    
    // Check if password input exists
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    
    // Check if confirm password input exists
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    
    // Check if signup button exists
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    
    // Check if login link exists
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  // Test Case 7: Updates all form inputs correctly
  test('updates all form inputs when user types', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Signup />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    
    await user.type(emailInput, 'newuser@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    
    expect(emailInput).toHaveValue('newuser@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  // Test Case 8: Displays error message when signup fails
  test('displays error message when signup error exists', () => {
    renderWithProviders(<Signup />, {
      preloadedState: {
        auth: { error: 'Email already in use' },
      },
    });
    
    expect(screen.getByText('Email already in use')).toBeInTheDocument();
  });

  // Test Case 9: Shows loading state on button
  test('disables button and shows loading text during signup', () => {
    renderWithProviders(<Signup />, {
      preloadedState: {
        auth: { isLoading: true },
      },
    });
    
    const signupButton = screen.getByRole('button');
    expect(signupButton).toBeDisabled();
    expect(screen.getByText(/signing up/i)).toBeInTheDocument();
  });

  // Test Case 10: Password inputs are of type password
  test('password inputs have type password for security', () => {
    renderWithProviders(<Signup />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });
});
