// Expenses.jsx - Refactored with Redux, Theme Support, and CSV Download
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
  setEditingExpense,
  selectExpenses,
  selectTotalAmount,
  selectExpensesLoading,
  selectExpensesError,
  selectEditingExpense,
  selectShowPremiumButton,
  activatePremium as activateExpensesPremium,
} from "../../store/slices/expensesSlice";
import {
  logout,
  selectUserId,
  selectIsAuthenticated,
} from "../../store/slices/authSlice";
import {
  toggleTheme,
  activatePremium as activateThemePremium,
  selectTheme,
  selectIsDarkMode,
  selectIsPremiumActivated,
} from "../../store/slices/themeSlice";
import "./Expenses.css";

function Expenses() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get state from Redux
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const expenses = useSelector(selectExpenses);
  const totalAmount = useSelector(selectTotalAmount);
  const loading = useSelector(selectExpensesLoading);
  const error = useSelector(selectExpensesError);
  const editingExpense = useSelector(selectEditingExpense);
  const showPremiumButton = useSelector(selectShowPremiumButton);
  const theme = useSelector(selectTheme);
  const isDarkMode = useSelector(selectIsDarkMode);
  const isPremiumActivated = useSelector(selectIsPremiumActivated);

  // Load expenses on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchExpenses(userId));
    }
  }, [dispatch, userId]);

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setDescription(editingExpense.description);
      setCategory(editingExpense.category);
    }
  }, [editingExpense]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !description || !category) {
      alert("Please fill all fields");
      return;
    }

    if (!userId) {
      alert("User not logged in");
      return;
    }

    const expenseData = {
      amount: Number(amount),
      description,
      category,
      date: new Date().toISOString(),
    };

    if (editingExpense) {
      await dispatch(
        updateExpense({
          userId,
          expenseId: editingExpense.id,
          expenseData,
        })
      );
    } else {
      await dispatch(
        addExpense({
          userId,
          expenseData,
        })
      );
    }

    // Clear form
    setAmount("");
    setDescription("");
    setCategory("Food");
  };

  const handleEdit = (expense) => {
    dispatch(setEditingExpense(expense));
  };

  const handleDelete = async (expenseId) => {
    if (userId) {
      await dispatch(deleteExpense({ userId, expenseId }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleBack = () => {
    navigate("/welcome");
  };

  const handleActivatePremium = () => {
    dispatch(activateExpensesPremium());
    dispatch(activateThemePremium());
    alert("Premium Activated! You now have access to dark theme and CSV download features.");
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // CSV Download Function
  const handleDownloadCSV = () => {
    if (expenses.length === 0) {
      alert("No expenses to download!");
      return;
    }

    // Create CSV header
    const headers = ["Date", "Description", "Category", "Amount (₹)"];
    
    // Create CSV rows
    const rows = expenses.map((expense) => [
      new Date(expense.date).toLocaleDateString(),
      expense.description,
      expense.category,
      expense.amount,
    ]);

    // Combine header and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      "", // Empty line
      `Total,${expenses.length} expenses,,₹${totalAmount.toFixed(2)}`,
    ].join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Calculate today's expenses
  const today = new Date().toDateString();
  const todaySpent = expenses
    .filter((exp) => new Date(exp.date).toDateString() === today)
    .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  return (
    <div className={`expenses-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Header */}
      <div className="expenses-header">
        <h1>Expense Tracker</h1>
        <div className="header-buttons">
          {isPremiumActivated && (
            <>
              <button 
                className="theme-toggle-btn" 
                onClick={handleToggleTheme}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
              <button 
                className="download-btn" 
                onClick={handleDownloadCSV}
                title="Download expenses as CSV"
              >
                📥 Download CSV
              </button>
            </>
          )}
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
            <div className="summary-value">₹{totalAmount.toFixed(2)}</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Today</div>
            <div className="summary-value today">₹{todaySpent.toFixed(2)}</div>
          </div>
        </div>

        {/* Premium Activation Banner */}
        {showPremiumButton && !isPremiumActivated && (
          <div
            className="premium-banner"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
              Your expenses have exceeded ₹10,000! 🎉
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
              Unlock Premium Features: Dark Theme & CSV Download
            </p>
            <button
              onClick={handleActivatePremium}
              style={{
                background: "#ffd700",
                color: "#333",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Activate Premium ✨
            </button>
          </div>
        )}

        {/* Premium Status Indicator */}
        {isPremiumActivated && (
          <div
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            ⭐ Premium Activated - Enjoy Dark Theme & CSV Export! ⭐
          </div>
        )}

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
            {editingExpense ? "Update Expense" : "Add Expense"}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            Error: {error}
          </div>
        )}

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
                  <span className="expense-amount">
                    ₹{parseFloat(expense.amount).toFixed(2)}
                  </span>
                  <div className="expense-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(expense)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(expense.id)}
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
