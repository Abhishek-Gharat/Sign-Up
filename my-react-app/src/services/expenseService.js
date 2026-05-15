import { database } from "./firebase";

import {
  ref,
  push,
  set,
  get,
  remove,
  onValue,
  off,
  update,
} from "firebase/database";

// USER EXPENSES REF
const getUserExpensesRef = (userId) => {
  return ref(database, `expenses/${userId}`);
};

// SINGLE EXPENSE REF
const getExpenseRef = (userId, expenseId) => {
  return ref(
    database,
    `expenses/${userId}/${expenseId}`
  );
};

// ADD EXPENSE
export const addExpense = async (
  userId,
  expenseData
) => {
  try {
    const expensesRef = getUserExpensesRef(userId);

    const newExpenseRef = push(expensesRef);

    const expense = {
      ...expenseData,
      id: newExpenseRef.key,
      createdAt: new Date().toISOString(),
    };

    await set(newExpenseRef, expense);

    return {
      success: true,
      expense,
    };
  } catch (error) {
    console.error(
      "Error adding expense:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

// GET EXPENSES
export const getExpenses = async (userId) => {
  try {
    const expensesRef =
      getUserExpensesRef(userId);

    const snapshot = await get(expensesRef);

    if (snapshot.exists()) {
      const expensesData = snapshot.val();

      const expenses =
        Object.values(expensesData);

      expenses.sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );

      return {
        success: true,
        expenses,
      };
    }

    return {
      success: true,
      expenses: [],
    };
  } catch (error) {
    console.error(
      "Error getting expenses:",
      error
    );

    return {
      success: false,
      expenses: [],
      error: error.message,
    };
  }
};

// REALTIME LISTENER
export const subscribeToExpenses = (
  userId,
  callback
) => {
  const expensesRef =
    getUserExpensesRef(userId);

  onValue(expensesRef, (snapshot) => {
    if (snapshot.exists()) {
      const expensesData = snapshot.val();

      const expenses =
        Object.values(expensesData);

      expenses.sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );

      callback(expenses);
    } else {
      callback([]);
    }
  });

  return () => off(expensesRef);
};

// DELETE EXPENSE
export const deleteExpense = async (
  userId,
  expenseId
) => {
  try {
    const expenseRef = getExpenseRef(
      userId,
      expenseId
    );

    await remove(expenseRef);

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Error deleting expense:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

// UPDATE EXPENSE
export const updateExpense = async (
  userId,
  expenseId,
  updates
) => {
  try {
    const expenseRef = getExpenseRef(
      userId,
      expenseId
    );

    await update(expenseRef, updates);

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Error updating expense:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};