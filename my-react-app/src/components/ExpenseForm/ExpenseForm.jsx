// ExpenseForm.jsx

import { useState } from "react";
import "./ExpenseForm.css";

function ExpenseForm({ onAddExpense }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const categories = [
    "Food",
    "Petrol",
    "Salary",
    "Rent",
    "Entertainment",
    "Utilities",
    "Transport",
    "Healthcare",
    "Shopping",
    "Other"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!amount || !description || !category) {
      setError("All fields are required");
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const now = new Date();
    const expense = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      category,
      date: now.toISOString()
    };

    onAddExpense(expense);

    // Clear form
    setAmount("");
    setDescription("");
    setCategory("");
  };

  return (
    <div className="expense-form-container">
      <h2>New Expense</h2>
      
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <div className="input-prefix">
              <span className="prefix">₹</span>
              <input
                type="number"
                id="amount"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-btn">
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
