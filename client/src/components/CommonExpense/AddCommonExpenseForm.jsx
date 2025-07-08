// src/components/CommonExpenses/AddCommonExpenseForm.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import CategoryDropdown from '../Shared/CategoryDropdown'; // Reusing the CategoryDropdown

/**
 * Form component for adding new common (recurring) expense definitions.
 * @param {object} props - Component props.
 * @param {Function} props.onAddCommonExpense - Callback function to handle the form submission.
 * @param {boolean} props.disabled - Boolean to disable the form during submission/loading.
 */
const AddCommonExpenseForm = ({ onAddCommonExpense, disabled }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    dayOfMonth: '', // Day of the month (1-31)
    startDate: '', // New: Start Date
    endDate: '',   // New: End Date (optional)
    termMonths: '', // NEW: Term in Months (optional)
    isActive: true, // Default to active
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for termMonths and endDate to ensure only one is primarily used
    if (name === 'termMonths' && value !== '') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        endDate: '', // Clear endDate if termMonths is being set
      }));
    } else if (name === 'endDate' && value !== '') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        termMonths: '', // Clear termMonths if endDate is being set
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      toast.error('Please enter a name for the common expense.');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category.');
      return;
    }
    if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be a positive number.');
      return;
    }
    if (isNaN(parseInt(formData.dayOfMonth)) || parseInt(formData.dayOfMonth) < 1 || parseInt(formData.dayOfMonth) > 31) {
      toast.error('Day of month must be between 1 and 31.');
      return;
    }
    if (!formData.startDate) {
      toast.error('Start date is required.');
      return;
    }
    const parsedStartDate = new Date(formData.startDate);
    if (isNaN(parsedStartDate.getTime())) {
      toast.error('Invalid start date.');
      return;
    }

    let parsedEndDate = null;
    if (formData.endDate) {
      parsedEndDate = new Date(formData.endDate);
      if (isNaN(parsedEndDate.getTime())) {
        toast.error('Invalid end date.');
        return;
      }
    }

    let parsedTermMonths = null;
    if (formData.termMonths !== '') {
      parsedTermMonths = parseInt(formData.termMonths);
      if (isNaN(parsedTermMonths) || parsedTermMonths < 1) {
        toast.error('Term in months must be a positive number.');
        return;
      }
    }

    // Final validation for endDate vs termMonths logic
    if (parsedEndDate && parsedTermMonths) {
      toast.warn('Both End Date and Term in Months are provided. End Date will take precedence.');
      // The backend model's pre-save hook will handle the actual precedence.
      // Here we just warn the user.
    } else if (!parsedEndDate && !parsedTermMonths) {
      // If neither is provided, it's an indefinite expense. This is allowed.
    }


    try {
      await onAddCommonExpense({
        ...formData,
        amount: parseFloat(formData.amount),
        dayOfMonth: parseInt(formData.dayOfMonth),
        startDate: parsedStartDate, // Send as Date object, hook will convert to ISO string
        endDate: parsedEndDate,      // Send as Date object or null
        termMonths: parsedTermMonths, // Send as Number or null
      });
      // Reset form after successful submission
      setFormData({
        name: '',
        category: '',
        amount: '',
        dayOfMonth: '',
        startDate: '',
        endDate: '',
        termMonths: '',
        isActive: true,
      });
    } catch (error) {
      // Error toast is handled by the useCommonExpenses hook
      console.error("Error submitting add common expense form:", error);
    }
  };

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Add New Recurring Expense</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="name" className="form-label">Expense Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Monthly Rent"
                required
                disabled={disabled}
              />
            </div>
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
                placeholder="e.g., 25000.00"
                required
                disabled={disabled}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="dayOfMonth" className="form-label">Day of Month</label>
              <select
                className="form-select"
                id="dayOfMonth"
                name="dayOfMonth"
                value={formData.dayOfMonth}
                onChange={handleChange}
                required
                disabled={disabled}
              >
                <option value="">Select Day</option>
                {daysInMonth.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                disabled={disabled}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="termMonths" className="form-label">Term (Months) <small className="text-muted">(Optional)</small></label>
              <input
                type="number"
                className="form-control"
                id="termMonths"
                name="termMonths"
                value={formData.termMonths}
                onChange={handleChange}
                min="1"
                placeholder="e.g., 12"
                disabled={disabled}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="endDate" className="form-label">End Date <small className="text-muted">(Optional, overrides Term)</small></label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={disabled}
              />
            </div>
            <div className="col-md-4 d-flex align-items-center">
              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  disabled={disabled}
                />
                <label className="form-check-label" htmlFor="isActive">Active for Auto-Insertion</label>
              </div>
            </div>
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-success" disabled={disabled}>
                {disabled ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  'Add Recurring Expense'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCommonExpenseForm;
