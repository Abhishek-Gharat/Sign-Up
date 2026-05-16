// __tests__/Counter.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Counter from '../src/components/Counter/Counter';
import counterReducer from '../src/store/counterSlice';

// Helper function to render component with Redux store
const renderWithStore = (component, { preloadedState = {} } = {}) => {
  const store = configureStore({
    reducer: { counter: counterReducer },
    preloadedState,
  });
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

// Test Suite for Counter Component
describe('Counter Component', () => {
  // Test Case 9: Renders counter with initial value
  test('renders counter with initial value of 0', () => {
    renderWithStore(<Counter />);
    
    // Check if the heading is rendered
    expect(screen.getByText('Redux Counter - Optimized Approach')).toBeInTheDocument();
    
    // Check if the counter value is 0
    const counterValue = screen.getByText('0');
    expect(counterValue).toBeInTheDocument();
    expect(counterValue).toHaveStyle({ color: '#007bff' });
  });

  // Test Case 10: Increments counter when increment button is clicked
  test('increments counter when increment button is clicked', async () => {
    const user = userEvent.setup();
    renderWithStore(<Counter />);
    
    // Find increment button and click it
    const incrementButton = screen.getByRole('button', { name: /increment \(\+1\)/i });
    await user.click(incrementButton);
    
    // Check if counter value is now 1
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Click increment button again
    await user.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
