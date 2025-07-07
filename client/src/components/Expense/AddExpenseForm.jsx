// src/components/Budget/AddBudgetForm.jsx
import React, { useState } from 'react';
import CategoryDropdown from '../Shared/CategoryDropdown'; // Import your reusable CategoryDropdown
import { toast } from 'react-toastify'; // <--- Import toast

/**
 * Form component for adding new budget records.
 * It takes an 'onAddBudget' prop which is a function to handle the actual addition.
 * It now uses a reusable CategoryDropdown component and React Toastify for validation messages.
 */
const AddBudgetForm = ({ onAddBudget, disabled }) => {
  const [formData, setFormData] = useState({
    category: '', // This will hold the selected category name
    amount: '',
    month: new Date().getMonth() + 1, // Default to current month (1-indexed)
    year: new Date().getFullYear(),   // Default to current year
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validation using toast
    if (!formData.category) {
      toast.error('Please select a category.');
      return;
    }
    if (!formData.amount) {
      toast.error('Please enter an amount.');
      return;
    }
    if (!formData.month || !formData.year) {
      toast.error('Month and Year are required.');
      return;
    }

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Amount must be a positive number.');
      return;
    }

    try {
      await onAddBudget({
        ...formData,
        amount: parsedAmount,
        month: parseInt(formData.month),
        year: parseInt(formData.year),
      });
      // Reset form after successful submission
      setFormData({
        category: '', // Reset category
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    } catch (error) {
      // Error handling (toast) for backend errors is done in the useBudget hook
      console.error("Error submitting add budget form:", error);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // Current year +/- 2

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-primary text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Set New Budget</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="category" className="form-label">Category</label>
              {/* Using the reusable CategoryDropdown component */}
              <CategoryDropdown
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={disabled}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="amount" className="form-label">Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g., 5000.00"
                required
                disabled={disabled}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="month" className="form-label">Month</label>
              <select
                className="form-select"
                id="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                disabled={disabled}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(currentYear, m - 1, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="year" className="form-label">Year</label>
              <select
                className="form-select"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                disabled={disabled}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary" disabled={disabled}>
                {disabled ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  'Set Budget'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetForm;
