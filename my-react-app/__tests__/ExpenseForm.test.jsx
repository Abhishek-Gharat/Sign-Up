// __tests__/ExpenseForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseForm from '../src/components/ExpenseForm/ExpenseForm';

// Test Suite for ExpenseForm Component
describe('ExpenseForm Component', () => {
  const mockOnAddExpense = jest.fn();

  beforeEach(() => {
    mockOnAddExpense.mockClear();
  });

  // Test Case 1: Renders form with all required fields
  test('renders expense form with all input fields', () => {
    render(<ExpenseForm onAddExpense={mockOnAddExpense} />);
    
    // Check if the heading is rendered
    expect(screen.getByText('New Expense')).toBeInTheDocument();
    
    // Check if amount input exists
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    
    // Check if description input exists
    expect(screen.getByPlaceholderText('What was this for?')).toBeInTheDocument();
    
    // Check if category select exists
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    
    // Check if submit button exists
    expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
  });

  // Test Case 2: Validates empty form submission
  test('shows error when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onAddExpense={mockOnAddExpense} />);
    
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);
    
    // Check if error message is displayed
    expect(screen.getByText('All fields are required')).toBeInTheDocument();
    expect(mockOnAddExpense).not.toHaveBeenCalled();
  });

  // Test Case 3: Validates invalid amount input (zero value)
  test('shows error when amount is zero', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onAddExpense={mockOnAddExpense} />);
    
    // Fill in description
    const descriptionInput = screen.getByPlaceholderText('What was this for?');
    await user.type(descriptionInput, 'Test expense');
    
    // Fill in amount with zero value (using fireEvent to bypass input validation)
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '0' } });
    
    // Select a category
    const categorySelect = screen.getByLabelText('Category');
    await user.selectOptions(categorySelect, 'Food');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);
    
    // Check if error message is displayed
    expect(screen.getByText(/Please enter a valid amount/)).toBeInTheDocument();
    expect(mockOnAddExpense).not.toHaveBeenCalled();
  });

  // Test Case 4: Successfully submits form with valid data
  test('submits form successfully with valid data', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onAddExpense={mockOnAddExpense} />);
    
    // Fill in amount
    const amountInput = screen.getByPlaceholderText('0.00');
    await user.type(amountInput, '100');
    
    // Fill in description
    const descriptionInput = screen.getByPlaceholderText('What was this for?');
    await user.type(descriptionInput, 'Groceries');
    
    // Select a category
    const categorySelect = screen.getByLabelText('Category');
    await user.selectOptions(categorySelect, 'Food');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);
    
    // Check if onAddExpense was called with correct data
    expect(mockOnAddExpense).toHaveBeenCalledTimes(1);
    expect(mockOnAddExpense).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 100,
        description: 'Groceries',
        category: 'Food',
      })
    );
    
    // Check form is cleared after submission
    expect(amountInput).toHaveValue(null);
    expect(descriptionInput).toHaveValue('');
  });
});
