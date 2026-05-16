// store.js - Redux store configuration for Expense Tracker
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import authReducer from './slices/authSlice';
import expensesReducer from './slices/expensesSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    expenses: expensesReducer,
    theme: themeReducer,
  },
});

export default store;
