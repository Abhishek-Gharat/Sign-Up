// __tests__/Counter.test.jsx
/**
 * Counter Component Tests
 * 
 * These tests verify:
 * - Counter renders with correct initial value
 * - Increment button increases counter value
 * - Decrement button decreases counter value
 * - Counter displays with correct styling
 * - Redux integration works properly
 */

import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Counter from '../src/components/Counter/Counter';
import counterReducer from '../src/store/counterSlice';

// Helper to render component with Redux store
const renderWithStore = (component, { preloadedState = {} } = {}) => {
  const store = configureStore({
    reducer: { counter: counterReducer },
    preloadedState,
  });
  return {
    store,
    ...render(<Provider store={store}>{component}</Provider>),
  };
};

describe('Counter Component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Initial Rendering', () => {
    test('renders counter with initial value of 0', () => {
      // Arrange & Act
      renderWithStore(<Counter />);
      
      // Assert
      expect(screen.getByText('Redux Counter - Optimized Approach')).toBeInTheDocument();
      const counterValue = screen.getByText('0');
      expect(counterValue).toBeInTheDocument();
      expect(counterValue).toHaveStyle({ color: '#007bff' });
    });

    test('renders counter with custom initial value from preloaded state', () => {
      // Arrange & Act
      renderWithStore(<Counter />, { preloadedState: { counter: { value: 10 } } });
      
      // Assert
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  describe('Increment Functionality', () => {
    test('increments counter when increment button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithStore(<Counter />);
      
      // Act: Click increment button
      const incrementButton = screen.getByRole('button', { name: /increment \(\+1\)/i });
      await user.click(incrementButton);
      
      // Assert
      expect(screen.getByText('1')).toBeInTheDocument();
      
      // Act: Click again
      await user.click(incrementButton);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    test('increment by amount button works correctly', async () => {
      // Arrange
      const user = userEvent.setup();
      const { store } = renderWithStore(<Counter />);
      
      // Act: Click increment by 2 button
      const incrementBy2Button = screen.getByRole('button', { name: /increment by 2/i });
      await user.click(incrementBy2Button);
      
      // Assert
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Decrement Functionality', () => {
    test('decrements counter when decrement button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithStore(<Counter />, { preloadedState: { counter: { value: 5 } } });
      
      // Act
      const decrementButton = screen.getByRole('button', { name: /decrement \(-1\)/i });
      await user.click(decrementButton);
      
      // Assert
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  describe('Button Rendering', () => {
    test('renders all counter control buttons', () => {
      // Arrange & Act
      renderWithStore(<Counter />);
      
      // Assert: Check all buttons are present (matching actual button text)
      expect(screen.getByRole('button', { name: /increment \(\+1\)/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /decrement \(-1\)/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /increment by 2/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /decrement by 2/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /incrementby5/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /decrementby5/i })).toBeInTheDocument();
    });
  });
});
