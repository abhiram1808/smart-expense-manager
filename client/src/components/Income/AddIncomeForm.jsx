// src/components/AddIncomeForm.jsx
import React, { useState } from 'react';
// This component should NOT directly call createIncome service.
// It should receive an 'onAddIncome' prop from the parent (IncomeListPage)
// which will be the addIncome function from useIncomeData hook.

/**
 * Form component for adding new income records.
 * It takes an 'onAddIncome' prop which is a function to handle the actual addition.
 */
const AddIncomeForm = ({ onAddIncome }) => { // Renamed prop to onAddIncome for clarity
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10), // Default to today's date (YYYY-MM-DD)
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic client-side validation
    if (!formData.source.trim() || !formData.amount || !formData.date) {
      // toast.error is handled by the parent component (useIncomeData)
      alert('Please fill in all required fields (Source, Amount, Date).'); // Using alert for now, replace with toast in parent
      setLoading(false);
      return;
    }
    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      // toast.error is handled by the parent component (useIncomeData)
      alert('Amount must be a positive number.'); // Using alert for now, replace with toast in parent
      setLoading(false);
      return;
    }

    try {
      // Call the onAddIncome prop (which comes from useIncomeData hook)
      await onAddIncome({
        ...formData,
        amount: parsedAmount, // Ensure amount is a number
        date: formData.date // Ensure date is sent as a string (backend converts to Date object)
      });
      setFormData({ // Reset form after successful submission
        source: '',
        amount: '',
        date: new Date().toISOString().slice(0, 10), // Reset date to today
      });
    } catch (error) {
      // Error handling is done in the useIncomeData hook, no need for toast here
      console.error("Error submitting add income form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Add New Income</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="source" className="form-label">Source</label>
              <input
                type="text"
                className="form-control"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="e.g., Salary, Freelance"
                required
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
                placeholder="e.g., 25000.00"
                required
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
              />
            </div>
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  'Add Income'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeForm;
