// __tests__/ExpenseList.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseList from '../src/components/ExpenseList/ExpenseList';

// Test Suite for ExpenseList Component
describe('ExpenseList Component', () => {
  const mockOnDeleteExpense = jest.fn();

  beforeEach(() => {
    mockOnDeleteExpense.mockClear();
  });

  // Test Case 5: Renders empty state when no expenses
  test('renders empty state when no expenses exist', () => {
    render(<ExpenseList expenses={[]} onDeleteExpense={mockOnDeleteExpense} />);
    
    expect(screen.getByText('Your Expenses')).toBeInTheDocument();
    expect(screen.getByText('No expenses added yet.')).toBeInTheDocument();
    expect(screen.getByText("Start adding your expenses above!")).toBeInTheDocument();
  });

  // Test Case 6: Renders expenses list correctly
  test('renders list of expenses correctly', () => {
    const expenses = [
      { id: 1, amount: 100, description: 'Groceries', category: 'Food', date: new Date().toISOString() },
      { id: 2, amount: 50, description: 'Gas', category: 'Petrol', date: new Date().toISOString() },
    ];
    
    render(<ExpenseList expenses={expenses} onDeleteExpense={mockOnDeleteExpense} />);
    
    // Check if expense descriptions are rendered
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Gas')).toBeInTheDocument();
    
    // Check if categories are rendered
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Petrol')).toBeInTheDocument();
    
    // Check if amounts are rendered
    expect(screen.getByText('₹100')).toBeInTheDocument();
    expect(screen.getByText('₹50')).toBeInTheDocument();
  });

  // Test Case 7: Calls delete handler when delete button is clicked
  test('calls onDeleteExpense when delete button is clicked', async () => {
    const user = userEvent.setup();
    const expenses = [
      { id: 1, amount: 100, description: 'Groceries', category: 'Food', date: new Date().toISOString() },
    ];
    
    render(<ExpenseList expenses={expenses} onDeleteExpense={mockOnDeleteExpense} />);
    
    // Find and click the delete button (using title attribute since button contains emoji)
    const deleteButton = screen.getByTitle('Delete expense');
    await user.click(deleteButton);
    
    // Check if delete handler was called with correct ID
    expect(mockOnDeleteExpense).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteExpense).toHaveBeenCalledWith(1);
  });

  // Test Case 8: Calculates and displays total correctly
  test('calculates and displays total amount correctly', () => {
    const expenses = [
      { id: 1, amount: 100.5, description: 'Groceries', category: 'Food', date: new Date().toISOString() },
      { id: 2, amount: 50, description: 'Gas', category: 'Petrol', date: new Date().toISOString() },
    ];
    
    render(<ExpenseList expenses={expenses} onDeleteExpense={mockOnDeleteExpense} />);
    
    // Check if total is calculated correctly (150.5)
    expect(screen.getByText(/Total: ₹150.50/)).toBeInTheDocument();
  });
});
