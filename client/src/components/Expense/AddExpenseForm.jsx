// src/components/Expenses/AddExpenseForm.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import CategoryDropdown from '../Shared/CategoryDropdown'; // Reusing the CategoryDropdown

/**
 * Form component for adding new expense records.
 * @param {object} props - Component props.
 * @param {Function} props.onAddExpense - Callback function to handle the form submission.
 * @param {boolean} props.disabled - Boolean to disable the form during submission/loading.
 */
const AddExpenseForm = ({ onAddExpense, disabled }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date in YYYY-MM-DD format
    description: '',
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

    // Client-side validation
    if (!formData.category) {
      toast.error('Please select an expense category.');
      return;
    }
    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Amount must be a positive number.');
      return;
    }
    if (!formData.date) {
      toast.error('Please select an expense date.');
      return;
    }
    // No need to parse date here, send the string as is.
    // The backend or hook will handle Date object conversion.

    try {
      await onAddExpense({
        ...formData,
        amount: parsedAmount, // Ensure amount is a number
        // date is already a YYYY-MM-DD string from the input, pass it directly
      });
      // Reset form after successful submission
      setFormData({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    } catch (error) {
      // Error toast is handled by the useExpenses hook
      console.error("Error submitting add expense form:", error);
    }
  };

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-primary text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Add New Expense</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="category" className="form-label">Category</label>
              <CategoryDropdown
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={disabled}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="amount" className="form-label">Amount (₹)</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g., 500.00"
                required
                disabled={disabled}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={disabled}
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="description" className="form-label">Description (Optional)</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                placeholder="e.g., Groceries from SuperMart"
                disabled={disabled}
              ></textarea>
            </div>
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary" disabled={disabled}>
                {disabled ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  'Add Expense'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
