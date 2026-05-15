// Expenses.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm";
import ExpenseList from "../../components/ExpenseList/ExpenseList";
import "./Expenses.css";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (expense) => {
    setExpenses([expense, ...expenses]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleBackToWelcome = () => {
    navigate("/welcome");
  };

  // Calculate summary
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const expenseCount = expenses.length;
  
  // Get today's expenses
  const today = new Date().toDateString();
  const todaySpent = expenses
    .filter(exp => new Date(exp.date).toDateString() === today)
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <h1>💰 Daily Expenses</h1>
        <div className="header-buttons">
          <button className="back-btn" onClick={handleBackToWelcome}>
            ← Back
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="expenses-content">
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-label">Total Spent</div>
            <div className="summary-value">
              ₹{totalSpent % 1 === 0 ? totalSpent : totalSpent.toFixed(2)}
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Today</div>
            <div className="summary-value today">
              ₹{todaySpent % 1 === 0 ? todaySpent : todaySpent.toFixed(2)}
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Entries</div>
            <div className="summary-value">{expenseCount}</div>
          </div>
        </div>
        
        <ExpenseForm onAddExpense={handleAddExpense} />
        <ExpenseList 
          expenses={expenses} 
          onDeleteExpense={handleDeleteExpense} 
        />
      </div>
    </div>
  );
}

export default Expenses;
