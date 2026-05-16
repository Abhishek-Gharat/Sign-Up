// expensesSlice.js - Expenses state management for Expense Tracker
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch expenses from Firebase
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await fetch(
        `https://my-web-app-ef23f-default-rtdb.firebaseio.com/expenses/${userId}.json?auth=${token}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch expenses');
      }

      // Convert Firebase object to array
      const expensesArray = [];
      let totalAmount = 0;

      if (data) {
        for (const key in data) {
          expensesArray.push({
            id: key,
            ...data[key],
          });
          totalAmount += parseFloat(data[key].amount) || 0;
        }
      }

      return { expenses: expensesArray, totalAmount };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add expense
export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async ({ userId, expenseData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await fetch(
        `https://my-web-app-ef23f-default-rtdb.firebaseio.com/expenses/${userId}.json?auth=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expenseData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add expense');
      }

      return {
        id: data.name,
        ...expenseData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete expense
export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async ({ userId, expenseId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await fetch(
        `https://my-web-app-ef23f-default-rtdb.firebaseio.com/expenses/${userId}/${expenseId}.json?auth=${token}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete expense');
      }

      return expenseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update expense
export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ userId, expenseId, expenseData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await fetch(
        `https://my-web-app-ef23f-default-rtdb.firebaseio.com/expenses/${userId}/${expenseId}.json?auth=${token}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expenseData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update expense');
      }

      return {
        id: expenseId,
        ...expenseData,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  expenses: [],
  totalAmount: 0,
  isLoading: false,
  error: null,
  editingExpense: null,
  isPremiumActivated: false,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setEditingExpense: (state, action) => {
      state.editingExpense = action.payload;
    },
    clearEditingExpense: (state) => {
      state.editingExpense = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    activatePremium: (state) => {
      state.isPremiumActivated = true;
    },
    deactivatePremium: (state) => {
      state.isPremiumActivated = false;
    },
    // Calculate total and check premium threshold
    calculateTotal: (state) => {
      state.totalAmount = state.expenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount || 0),
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload.expenses;
        state.totalAmount = action.payload.totalAmount;
        // Show premium button if total > 10000
        if (action.payload.totalAmount > 10000 && !state.isPremiumActivated) {
          // Just a flag, we'll show the button in UI
        }
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add expense
      .addCase(addExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses.push(action.payload);
        state.totalAmount += parseFloat(action.payload.amount || 0);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete expense
      .addCase(deleteExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedExpense = state.expenses.find(
          (expense) => expense.id === action.payload
        );
        if (deletedExpense) {
          state.totalAmount -= parseFloat(deletedExpense.amount || 0);
          state.expenses = state.expenses.filter(
            (expense) => expense.id !== action.payload
          );
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update expense
      .addCase(updateExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.expenses.findIndex(
          (expense) => expense.id === action.payload.id
        );
        if (index !== -1) {
          // Update total amount
          const oldAmount = parseFloat(state.expenses[index].amount || 0);
          const newAmount = parseFloat(action.payload.amount || 0);
          state.totalAmount = state.totalAmount - oldAmount + newAmount;
          // Update expense
          state.expenses[index] = action.payload;
        }
        state.editingExpense = null;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setEditingExpense,
  clearEditingExpense,
  clearError,
  activatePremium,
  deactivatePremium,
  calculateTotal,
} = expensesSlice.actions;

// Selectors
export const selectExpenses = (state) => state.expenses.expenses;
export const selectTotalAmount = (state) => state.expenses.totalAmount;
export const selectExpensesLoading = (state) => state.expenses.isLoading;
export const selectExpensesError = (state) => state.expenses.error;
export const selectEditingExpense = (state) => state.expenses.editingExpense;
export const selectIsPremiumActivated = (state) =>
  state.expenses.isPremiumActivated;

// Derived selector for premium eligibility
export const selectShowPremiumButton = (state) => {
  const total = state.expenses.totalAmount;
  return total > 10000 && !state.expenses.isPremiumActivated;
};

export default expensesSlice.reducer;
