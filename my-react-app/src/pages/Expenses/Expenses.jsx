// Expenses.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import {
  addExpense,
  subscribeToExpenses,
  deleteExpense,
  updateExpense,
} from "../../services/expenseService";
import "./Expenses.css";

function Expenses() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
const [editingId, setEditingId] =
  useState(null);
  // GET LOGGED IN USER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
        }
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // LOAD EXPENSES
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToExpenses(user.uid, (fetchedExpenses) => {
      setExpenses(fetchedExpenses);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // ADD EXPENSE
const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !amount ||
    !description ||
    !category
  ) {
    alert("Please fill all fields");

    return;
  }

  if (!user) {
    alert("User not logged in");

    return;
  }

  const expenseData = {
    amount: Number(amount),
    description,
    category,
    date: new Date().toISOString(),
  };

  let result;

  // UPDATE EXPENSE
  if (editingId) {
    result = await updateExpense(
      user.uid,
      editingId,
      expenseData
    );

    if (result.success) {
      console.log(
        "Expense updated successfully"
      );

      // RESET EDIT MODE
      setEditingId(null);

      setAmount("");
      setDescription("");
      setCategory("");
    }
  }

  // ADD EXPENSE
  else {
    result = await addExpense(
      user.uid,
      expenseData
    );

    if (result.success) {
      setAmount("");
      setDescription("");
      setCategory("");
    }
  }

  if (!result.success) {
    alert(result.error);
  }
};


const handleEdit = (expense) => {
  setAmount(expense.amount);

  setDescription(
    expense.description
  );

  setCategory(expense.category);

  setEditingId(expense.id);
};
  // DELETE EXPENSE
const handleDelete = async (id) => {
  if (!user) return;

  const result = await deleteExpense(
    user.uid,
    id
  );

  if (result.success) {
    console.log(
      "Expense successfully deleted"
    );
  }
};

  // HANDLE LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  // HANDLE BACK
  const handleBack = () => {
    navigate("/welcome");
  };

  // FORMAT DATE
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7)
      return date.toLocaleDateString("en-US", { weekday: "short" });

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // CALCULATE TOTALS
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const today = new Date().toDateString();
  const todaySpent = expenses
    .filter((exp) => new Date(exp.date).toDateString() === today)
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="expenses-page">
      {/* Header */}
      <div className="expenses-header">
        <h1>Expense Tracker</h1>
        <div className="header-buttons">
          <button className="back-btn" onClick={handleBack}>
            Back
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="expenses-content">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-label">Total Expenses</div>
            <div className="summary-value">{expenses.length}</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Total Amount</div>
            <div className="summary-value">₹{totalSpent.toFixed(2)}</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Today</div>
            <div className="summary-value today">₹{todaySpent.toFixed(2)}</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="expense-form">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Petrol</option>
            <option>Shopping</option>
            <option>Salary</option>
            <option>Bills</option>
          </select>
<button type="submit">
  {editingId
    ? "Update Expense"
    : "Add Expense"}
</button>        </form>

        {/* Loading */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="no-expenses">
            <p>No expenses found</p>
            <p className="sub-text">Add your first expense above!</p>
          </div>
        ) : (
          <div className="expense-list-container">
            {expenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="expense-item-info">
                  <div className="expense-item-header">
                    <span className="expense-description">
                      {expense.description}
                    </span>
                    <span className="expense-category">{expense.category}</span>
                  </div>
                  <div className="expense-date">{formatDate(expense.date)}</div>
                </div>
                <div className="expense-item-actions">
                  <span className="expense-amount">₹{expense.amount.toFixed(2)}</span>
                 <div className="expense-buttons">

  <button
    className="edit-btn"
    onClick={() =>
      handleEdit(expense)
    }
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() =>
      handleDelete(expense.id)
    }
  >
    Delete
  </button>

</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;
