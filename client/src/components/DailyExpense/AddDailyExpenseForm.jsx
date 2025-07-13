// client/src/components/DailyExpense/AddDailyExpenseForm.jsx
import React, { useState } from 'react'; // Removed useEffect, useMemo, category fetching states
import { toast } from 'react-toastify';
import { createExpense } from '../../services/expenseService';
// Removed import for fetchCategories
// Removed imports for ErrorDisplay, SkeletonLoader
import CategoryDropdown from '../Shared/CategoryDropdown'; // <--- NEW: Import CategoryDropdown

/**
 * Form component for adding a new daily expense.
 * Includes fields for description, amount, category, and date.
 * Fetches categories dynamically from the backend.
 * @param {object} props - Component props.
 * @param {Function} [props.onExpenseAdded] - Callback function to run after an expense is successfully added.
 */
const AddDailyExpenseForm = ({ onExpenseAdded }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add a disabled variable for form controls
  const disabled = isSubmitting;

  // Generic handleChange for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description') setDescription(value);
    else if (name === 'amount') setAmount(value);
    else if (name === 'category') setCategory(value);
    else if (name === 'date') setDate(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !amount || !category || !date) {
      toast.error('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newExpense = {
        description: description.trim() || '', // Allow empty description
        amount: parseFloat(amount),
        category,
        date,
      };
      await createExpense(newExpense);
      toast.success('Expense added successfully! 🎉');
      setDescription('');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (err) {
      console.error('Error adding expense:', err.response?.data || err.message);
      toast.error(`Failed to add expense: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}> {/* <--- CARD STRUCTURE HERE */}
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
                value={category}
                onChange={handleChange}
                categoryType="expense" // Specify the type of categories needed
                required={true}
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
                value={amount}
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
                value={date}
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
                value={description}
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

export default AddDailyExpenseForm;
