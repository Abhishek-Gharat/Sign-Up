// __tests__/Login.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/pages/Login/Login';
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

// Test Suite for Login Component
describe('Login Component', () => {
  // Test Case 1: Renders login form with all fields
  test('renders login form with email and password inputs', () => {
    renderWithProviders(<Login />);
    
    // Check if heading is rendered
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    
    // Check if email input exists
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    
    // Check if password input exists
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    
    // Check if login button exists
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    
    // Check if forgot password link exists
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    
    // Check if sign up link exists
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  // Test Case 2: Updates email input value on change
  test('updates email input when user types', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  // Test Case 3: Updates password input value on change
  test('updates password input when user types', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    await user.type(passwordInput, 'password123');
    
    expect(passwordInput).toHaveValue('password123');
  });

  // Test Case 4: Displays error message when provided
  test('displays error message when error exists in state', () => {
    renderWithProviders(<Login />, {
      preloadedState: {
        auth: { error: 'Invalid credentials' },
      },
    });
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  // Test Case 5: Shows loading state on button when isLoading is true
  test('shows loading state when authentication is in progress', () => {
    renderWithProviders(<Login />, {
      preloadedState: {
        auth: { isLoading: true },
      },
    });
    
    const loginButton = screen.getByRole('button');
    expect(loginButton).toBeDisabled();
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
  });
});
