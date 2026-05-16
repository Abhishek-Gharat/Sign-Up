// __tests__/ExpenseList.test.jsx
/**
 * ExpenseList Component Tests
 * 
 * These tests verify:
 * - Empty state is shown when no expenses exist
 * - Expenses are rendered correctly with all details
 * - Delete functionality works properly
 * - Total amount is calculated correctly
 * - Category icons and colors are applied
 */

import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseList from '../src/components/ExpenseList/ExpenseList';

// Mock function for onDeleteExpense callback
const mockOnDeleteExpense = jest.fn();

describe('ExpenseList Component', () => {
  afterEach(() => {
    cleanup();
    mockOnDeleteExpense.mockClear();
  });

  describe('Empty State', () => {
    test('renders empty state when no expenses exist', () => {
      // Arrange & Act
      render(<ExpenseList expenses={[]} onDeleteExpense={mockOnDeleteExpense} />);
      
      // Assert
      expect(screen.getByText('Your Expenses')).toBeInTheDocument();
      expect(screen.getByText('No expenses added yet.')).toBeInTheDocument();
      expect(screen.getByText("Start adding your expenses above!")).toBeInTheDocument();
    });
  });

  describe('Expense Rendering', () => {
    test('renders list of expenses with all details', () => {
      // Arrange
      const expenses = [
        { id: 1, amount: 100, description: 'Groceries', category: 'Food', date: new Date().toISOString() },
        { id: 2, amount: 50, description: 'Gas', category: 'Petrol', date: new Date().toISOString() },
      ];
      
      // Act
      render(<ExpenseList expenses={expenses} onDeleteExpense={mockOnDeleteExpense} />);
      
      // Assert: Check descriptions
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Gas')).toBeInTheDocument();
      
      // Assert: Check categories
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Petrol')).toBeInTheDocument();
      
      // Assert: Check amounts with currency
      expect(screen.getByText('₹100')).toBeInTheDocument();
      expect(screen.getByText('₹50')).toBeInTheDocument();
    });

    test('displays category icons correctly', () => {
      // Arrange
      const expenses = [
        { id: 1, amount: 100, description: 'Test', category: 'Food', date: new Date().toISOString() },
      ];
      
      // Act
      render(<ExpenseList expenses={expenses} onDeleteExpense={mockOnDeleteExpense} />);
      
      // Assert: Check icon is rendered (🍽️ for Food)
      expect(screen.getByText('🍽️')).toBeInTheDocument();
    });
  });

  describe('Delete Functionality', () => {
    test('calls onDeleteExpense with correct ID when delete button clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const expenses = [
        { id: 1, amount: 100, description: 'Groceries', category: 'Food', date: new Date().toISOString() },
      ];
      
      render(<ExpenseList expenses={expenses} onDeleteExpense={mockOnDeleteExpense} />);
      
      // Act
      const deleteButton = screen.getByTitle('Delete expense');
      await user.click(deleteButton);
      
      // Assert
      expect(mockOnDeleteExpense).toHaveBeenCalledTimes(1);
      expect(mockOnDeleteExpense).toHaveBeenCalledWith(1);
    });
  });

  describe('Total Calculation', () => {
    test('calculates and displays total amount with 2 decimal places', () => {
      // Arrange
      const expenses = [
        { id: 1, amount: 100.5, description: 'Groceries', category: 'Food', date: new Date().toISOString() },
        { id: 2, amount: 50, description: 'Gas', category: 'Petrol', date: new Date().toISOString() },
      ];
      
      // Act
      render(<ExpenseList expenses={expenses} onDeleteExpense={mockOnDeleteExpense} />);
      
      // Assert
      expect(screen.getByText(/Total: ₹150.50/)).toBeInTheDocument();
    });

    test('displays integer amounts without decimal places', () => {
      // Arrange
      const expenses = [
        { id: 1, amount: 100, description: 'Test', category: 'Food', date: new Date().toISOString() },
      ];
      
      // Act
      render(<ExpenseList expenses={expenses} onDeleteExpense={mockOnDeleteExpense} />);
      
      // Assert
      expect(screen.getByText('₹100')).toBeInTheDocument();
      expect(screen.queryByText('₹100.00')).not.toBeInTheDocument();
    });
  });
});
