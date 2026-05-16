// __tests__/ExpenseForm.test.jsx
/**
 * ExpenseForm Component Tests
 * 
 * These tests verify:
 * - Component renders correctly with all form fields
 * - Form validation works for empty submissions
 * - Form validation works for invalid amount values
 * - Form submission works with valid data
 * - Form clears after successful submission
 */

import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseForm from '../src/components/ExpenseForm/ExpenseForm';

// Mock function for onAddExpense callback
const mockOnAddExpense = jest.fn();

describe('ExpenseForm Component', () => {
  // Clean up after each test to prevent memory leaks
  afterEach(() => {
    cleanup();
    mockOnAddExpense.mockClear();
  });

  describe('Rendering', () => {
    test('renders expense form with all input fields', () => {
      // Arrange: Render the component
      render(<ExpenseForm onAddExpense={mockOnAddExpense} />);
      
      // Assert: Verify all form elements are present
      expect(screen.getByText('New Expense')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('What was this for?')).toBeInTheDocument();
      expect(screen.getByLabelText('Category')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    test('shows error when submitting empty form', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ExpenseForm onAddExpense={mockOnAddExpense} />);
      
      // Act: Submit empty form
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);
      
      // Assert: Error message displayed and callback not called
      expect(screen.getByText('All fields are required')).toBeInTheDocument();
      expect(mockOnAddExpense).not.toHaveBeenCalled();
    });

    test('shows error when amount is zero or negative', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ExpenseForm onAddExpense={mockOnAddExpense} />);
      
      // Act: Fill form with zero amount
      const descriptionInput = screen.getByPlaceholderText('What was this for?');
      await user.type(descriptionInput, 'Test expense');
      
      const amountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(amountInput, { target: { value: '0' } });
      
      const categorySelect = screen.getByLabelText('Category');
      await user.selectOptions(categorySelect, 'Food');
      
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);
      
      // Assert
      expect(screen.getByText(/Please enter a valid amount/)).toBeInTheDocument();
      expect(mockOnAddExpense).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    test('submits form successfully with valid data and clears inputs', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ExpenseForm onAddExpense={mockOnAddExpense} />);
      
      // Act: Fill form with valid data
      const amountInput = screen.getByPlaceholderText('0.00');
      await user.type(amountInput, '100');
      
      const descriptionInput = screen.getByPlaceholderText('What was this for?');
      await user.type(descriptionInput, 'Groceries');
      
      const categorySelect = screen.getByLabelText('Category');
      await user.selectOptions(categorySelect, 'Food');
      
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);
      
      // Assert: Callback called with correct data
      expect(mockOnAddExpense).toHaveBeenCalledTimes(1);
      expect(mockOnAddExpense).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 100,
          description: 'Groceries',
          category: 'Food',
          id: expect.any(Number),
          date: expect.any(String),
        })
      );
      
      // Assert: Form inputs are cleared
      expect(amountInput).toHaveValue(null);
      expect(descriptionInput).toHaveValue('');
    });

    test('submits form with decimal amounts correctly', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ExpenseForm onAddExpense={mockOnAddExpense} />);
      
      // Act: Fill form with decimal amount
      const amountInput = screen.getByPlaceholderText('0.00');
      await user.type(amountInput, '99.99');
      
      const descriptionInput = screen.getByPlaceholderText('What was this for?');
      await user.type(descriptionInput, 'Restaurant dinner');
      
      const categorySelect = screen.getByLabelText('Category');
      await user.selectOptions(categorySelect, 'Food');
      
      const submitButton = screen.getByRole('button', { name: /add expense/i });
      await user.click(submitButton);
      
      // Assert: Amount parsed correctly as float
      expect(mockOnAddExpense).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 99.99,
          description: 'Restaurant dinner',
          category: 'Food',
        })
      );
    });
  });
});
