// ExpenseList.jsx

import "./ExpenseList.css";

function ExpenseList({ expenses, onDeleteExpense }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Food: "🍽️",
      Petrol: "⛽",
      Salary: "💰",
      Rent: "🏠",
      Entertainment: "🎬",
      Utilities: "💡",
      Transport: "🚌",
      Healthcare: "🏥",
      Shopping: "🛍️",
      Other: "📦"
    };
    return icons[category] || "📦";
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: "#fef3c7",
      Petrol: "#dbeafe",
      Salary: "#d1fae5",
      Rent: "#fce7f3",
      Entertainment: "#fce7f3",
      Utilities: "#fef3c7",
      Transport: "#e0e7ff",
      Healthcare: "#ffe4e6",
      Shopping: "#f3e8ff",
      Other: "#f3f4f6"
    };
    return colors[category] || "#f3f4f6";
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const formatTotal = (amount) => {
    return amount % 1 === 0 ? `₹${amount}` : `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2>Your Expenses</h2>
        <div className="total-amount">
          Total: {formatTotal(totalAmount)}
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="no-expenses">
          <p>No expenses added yet.</p>
          <p className="sub-text">Start adding your expenses above!</p>
        </div>
      ) : (
        <div className="expenses-list">
          {expenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div className="expense-icon" style={{ backgroundColor: getCategoryColor(expense.category) }}>
                <span>{getCategoryIcon(expense.category)}</span>
              </div>
              
              <div className="expense-details">
                <div className="expense-main">
                  <span className="expense-description">{expense.description}</span>
                  <span className="expense-category">{expense.category}</span>
                </div>
                <div className="expense-meta">
                  <span className="expense-date">{formatDate(expense.date)}</span>
                </div>
              </div>

              <div className="expense-amount-section">
                <span className="expense-amount">
                  {expense.amount % 1 === 0 
                    ? `₹${expense.amount}` 
                    : `₹${expense.amount.toFixed(2)}`}
                </span>
                <button 
                  className="delete-btn"
                  onClick={() => onDeleteExpense(expense.id)}
                  title="Delete expense"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
