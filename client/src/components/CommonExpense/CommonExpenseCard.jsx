// src/components/CommonExpenses/CommonExpenseCard.jsx
import React, { useState, useMemo } from 'react';
import { FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaSave, FaBan, FaCalendarAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CategoryDropdown from '../Shared/CategoryDropdown';
import ActionModal from '../common/ActionModal'; // Reusing ActionModal for edit form

/**
 * Helper function to calculate the number of months between two dates.
 * Accounts for partial months by counting full month boundaries.
 */
const getMonthsBetween = (d1, d2) => {
  if (!d1 || !d2) return 0;
  const date1 = new Date(d1);
  const date2 = new Date(d2);

  let months;
  months = (date2.getFullYear() - date1.getFullYear()) * 12;
  months -= date1.getMonth();
  months += date2.getMonth();

  // If the end day is before the start day in the last month, subtract a month
  if (date2.getDate() < date1.getDate()) {
    months--;
  }
  return months >= 0 ? months : 0;
};

/**
 * Renders a single common expense as an attractive card with progress details and actions.
 * @param {object} props - Component props.
 * @param {object} props.commonExpense - The common expense object to display.
 * @param {Function} props.onDelete - Callback for initiating a delete action.
 * @param {Function} props.onUpdate - Callback for updating a common expense.
 * @param {boolean} props.isDeleting - Global state indicating if a delete operation is in progress.
 * @param {boolean} props.isUpdating - Global state indicating if an update operation is in progress.
 */
const CommonExpenseCard = ({ commonExpense, onDelete, onUpdate, isDeleting, isUpdating }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedData, setEditedData] = useState({
    name: commonExpense.name,
    category: commonExpense.category,
    amount: commonExpense.amount,
    dayOfMonth: commonExpense.dayOfMonth,
    startDate: commonExpense.startDate ? new Date(commonExpense.startDate).toISOString().split('T')[0] : '',
    endDate: commonExpense.endDate ? new Date(commonExpense.endDate).toISOString().split('T')[0] : '',
    termMonths: commonExpense.termMonths !== null ? commonExpense.termMonths : '',
    isActive: commonExpense.isActive,
  });

  // Memoized calculations for progress and amounts
  const { totalTermMonths, elapsedMonths, remainingMonths, progressPercentage, totalProjectedAmount, remainingProjectedAmount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    const startDate = commonExpense.startDate ? new Date(commonExpense.startDate) : null;
    let effectiveEndDate = commonExpense.endDate ? new Date(commonExpense.endDate) : null;
    let totalTerm = commonExpense.termMonths;

    // If termMonths is not explicitly set, try to derive it from startDate and endDate
    if (totalTerm === null && startDate && effectiveEndDate) {
        totalTerm = getMonthsBetween(startDate, effectiveEndDate);
    } else if (totalTerm !== null && startDate && !effectiveEndDate) {
        // If termMonths is set but endDate isn't, calculate endDate for display consistency
        effectiveEndDate = new Date(startDate);
        effectiveEndDate.setMonth(startDate.getMonth() + totalTerm);
        effectiveEndDate.setDate(startDate.getDate()); // Keep the same day of month
        effectiveEndDate.setHours(0, 0, 0, 0); // Normalize to start of day
    }

    let elapsed = 0;
    let remaining = 0;
    let progress = 0;
    let totalProjAmount = 0;
    let remainingProjAmount = 0;

    if (startDate) {
        if (totalTerm !== null && totalTerm !== undefined && totalTerm !== 'Indefinite') { // Fixed term expense
            elapsed = getMonthsBetween(startDate, today);
            if (elapsed < 0) elapsed = 0; // If start date is in future, no elapsed months

            remaining = totalTerm - elapsed;
            if (remaining < 0) remaining = 0; // Don't show negative remaining months

            progress = totalTerm > 0 ? (elapsed / totalTerm) * 100 : 0;
            if (progress > 100) progress = 100; // Cap at 100%

            totalProjAmount = commonExpense.amount * totalTerm;
            remainingProjAmount = commonExpense.amount * remaining;

        } else if (effectiveEndDate) { // Indefinite but with an end date (derived from endDate)
            totalTerm = getMonthsBetween(startDate, effectiveEndDate);
            if (totalTerm < 0) totalTerm = 0;

            elapsed = getMonthsBetween(startDate, today);
            if (elapsed < 0) elapsed = 0;

            remaining = totalTerm - elapsed;
            if (remaining < 0) remaining = 0;

            progress = totalTerm > 0 ? (elapsed / totalTerm) * 100 : 0;
            if (progress > 100) progress = 100;

            totalProjAmount = commonExpense.amount * totalTerm;
            remainingProjAmount = commonExpense.amount * remaining;

        } else { // Truly indefinite (no termMonths, no endDate)
            totalTerm = 'Indefinite'; // Display string
            elapsed = 'N/A';
            remaining = 'N/A';
            progress = 0; // For indefinite, progress is not meaningful, but 0 makes bar render
            totalProjAmount = 'N/A';
            remainingProjAmount = 'N/A';
        }
    } else { // No start date (shouldn't happen with validation, but for safety)
        totalTerm = 'N/A';
        elapsed = 'N/A';
        remaining = 'N/A';
        progress = 0;
        totalProjAmount = 'N/A';
        remainingProjAmount = 'N/A';
    }


    return {
      totalTermMonths: totalTerm,
      elapsedMonths: elapsed,
      remainingMonths: remaining,
      progressPercentage: progress,
      totalProjectedAmount: totalProjAmount,
      remainingProjectedAmount: remainingProjAmount,
    };
  }, [commonExpense]); // Recalculate if commonExpense object changes

  // Helper to format Date objects to YYYY-MM-DD for input value
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Helper to format Date objects for display (e.g., "Jan 1, 2023")
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'termMonths' && value !== '') {
      setEditedData((prev) => ({
        ...prev,
        [name]: value,
        endDate: '', // Clear endDate if termMonths is being set
      }));
    } else if (name === 'endDate' && value !== '') {
      setEditedData((prev) => ({
        ...prev,
        [name]: value,
        termMonths: '', // Clear termMonths if endDate is being set
      }));
    } else {
      setEditedData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSave = async () => {
    // Client-side validation for edited data
    if (!editedData.name.trim()) {
      toast.error('Expense name cannot be empty.');
      return;
    }
    if (!editedData.category) {
      toast.error('Category cannot be empty.');
      return;
    }
    if (isNaN(parseFloat(editedData.amount)) || parseFloat(editedData.amount) <= 0) {
      toast.error('Amount must be a positive number.');
      return;
    }
    if (isNaN(parseInt(editedData.dayOfMonth)) || parseInt(editedData.dayOfMonth) < 1 || parseInt(editedData.dayOfMonth) > 31) {
      toast.error('Day of month must be between 1 and 31.');
      return;
    }
    if (!editedData.startDate) {
      toast.error('Start date is required.');
      return;
    }
    const parsedStartDate = new Date(editedData.startDate);
    if (isNaN(parsedStartDate.getTime())) {
      toast.error('Invalid start date.');
      return;
    }

    let parsedEndDate = null;
    if (editedData.endDate) {
      parsedEndDate = new Date(editedData.endDate);
      if (isNaN(parsedEndDate.getTime())) {
        toast.error('Invalid end date.');
        return;
      }
    }

    let parsedTermMonths = null;
    if (editedData.termMonths !== '') {
      parsedTermMonths = parseInt(editedData.termMonths);
      if (isNaN(parsedTermMonths) || parsedTermMonths < 1) {
        toast.error('Term in months must be a positive number.');
        return;
      }
    }

    if (parsedEndDate && parsedTermMonths) {
      toast.warn('Both End Date and Term in Months are provided. End Date will take precedence on backend.');
    }

    try {
      await onUpdate(commonExpense._id, {
        ...editedData,
        amount: parseFloat(editedData.amount),
        dayOfMonth: parseInt(editedData.dayOfMonth),
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        termMonths: parsedTermMonths,
      });
      setShowEditModal(false); // Close modal on successful update
    } catch (error) {
      console.error("Error saving common expense:", error);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    // Reset edited data to original common expense data
    setEditedData({
      name: commonExpense.name,
      category: commonExpense.category,
      amount: commonExpense.amount,
      dayOfMonth: commonExpense.dayOfMonth,
      startDate: commonExpense.startDate ? new Date(commonExpense.startDate).toISOString().split('T')[0] : '',
      endDate: commonExpense.endDate ? new Date(commonExpense.endDate).toISOString().split('T')[0] : '',
      termMonths: commonExpense.termMonths !== null ? commonExpense.termMonths : '',
      isActive: commonExpense.isActive,
    });
  };

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="col-md-6 col-lg-4 mb-4"> {/* Responsive column sizing */}
      <div className="card h-100 shadow-sm border-success" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h5 className="mb-0 text-truncate" title={commonExpense.name}>{commonExpense.name}</h5>
          <span className={`badge bg-${commonExpense.isActive ? 'primary' : 'danger'} ms-2`}>
            {commonExpense.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="card-body">
          <p className="card-text mb-1"><strong>Category:</strong> {commonExpense.category}</p>
          <p className="card-text mb-1"><strong>Amount:</strong> ₹{commonExpense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="card-text mb-1"><strong>Due Day:</strong> {commonExpense.dayOfMonth}</p>
          <p className="card-text mb-1"><strong>Start Date:</strong> {formatDateForDisplay(commonExpense.startDate)}</p>
          <p className="card-text mb-1"><strong>End Date:</strong> {formatDateForDisplay(commonExpense.endDate)}</p>
          <p className="card-text mb-3"><strong>Term:</strong> {commonExpense.termMonths || 'Indefinite'} months</p>

          {/* Progress Bar Section */}
          {totalTermMonths !== 'Indefinite' && totalTermMonths > 0 ? (
            <div className="mb-3">
              <h6 className="mb-2">Progress:</h6>
              <div className="progress" style={{ height: '25px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
                <div
                  className={`progress-bar ${progressPercentage >= 100 ? 'bg-success' : 'bg-info'}`}
                  role="progressbar"
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {progressPercentage.toFixed(0)}%
                </div>
              </div>
              <small className="text-muted mt-1 d-block text-center">
                {elapsedMonths} of {totalTermMonths} months elapsed
              </small>
            </div>
          ) : (
            <p className="text-muted text-center mb-3"><FaClock className="me-1" />Indefinite Term</p>
          )}

          {/* Amount Summary */}
          <div className="row text-center mb-3">
            <div className="col-6">
              <div className="p-2 border rounded bg-light">
                <small className="text-muted d-block">Total Projected</small>
                <strong className="text-primary">
                  {totalProjectedAmount !== 'N/A' ? `₹${totalProjectedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                </strong>
              </div>
            </div>
            <div className="col-6">
              <div className="p-2 border rounded bg-light">
                <small className="text-muted d-block">Remaining Projected</small>
                <strong className="text-danger">
                  {remainingProjectedAmount !== 'N/A' ? `₹${remainingProjectedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                </strong>
              </div>
            </div>
          </div>
          <p className="card-text text-muted text-center"><small>Last Auto-Inserted: {formatDateForDisplay(commonExpense.lastInsertedDate)}</small></p>
        </div>
        <div className="card-footer bg-light d-flex justify-content-end gap-2">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowEditModal(true)}
            disabled={isDeleting || isUpdating}
            title="Edit Recurring Expense"
          >
            <FaEdit /> Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(commonExpense._id)}
            disabled={isDeleting || isUpdating}
            title="Delete Recurring Expense"
          >
            {isDeleting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <FaTrashAlt />} Delete
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <ActionModal
        show={showEditModal}
        type="edit"
        title={`Edit: ${commonExpense.name}`}
        onConfirm={handleSave}
        onClose={handleCancelEdit}
        confirmButtonText={isUpdating ? 'Saving...' : 'Save Changes'}
        confirmButtonClass="btn-success"
        cancelButtonClass="btn-secondary"
        size="lg" // Make modal larger for more fields
      >
        <form>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="edit-name" className="form-label">Expense Name</label>
              <input type="text" className="form-control" id="edit-name" name="name" value={editedData.name} onChange={handleEditChange} disabled={isUpdating} />
            </div>
            <div className="col-md-6">
              <label htmlFor="edit-category" className="form-label">Category</label>
              <CategoryDropdown id="edit-category" name="category" value={editedData.category} onChange={handleEditChange} disabled={isUpdating} className="form-select" />
            </div>
            <div className="col-md-6">
              <label htmlFor="edit-amount" className="form-label">Amount (₹)</label>
              <input type="number" className="form-control" id="edit-amount" name="amount" value={editedData.amount} onChange={handleEditChange} step="0.01" disabled={isUpdating} />
            </div>
            <div className="col-md-6">
              <label htmlFor="edit-dayOfMonth" className="form-label">Day of Month</label>
              <select className="form-select" id="edit-dayOfMonth" name="dayOfMonth" value={editedData.dayOfMonth} onChange={handleEditChange} disabled={isUpdating}>
                {daysInMonth.map((day) => (<option key={day} value={day}>{day}</option>))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="edit-startDate" className="form-label">Start Date</label>
              <input type="date" className="form-control" id="edit-startDate" name="startDate" value={editedData.startDate} onChange={handleEditChange} disabled={isUpdating} />
            </div>
            <div className="col-md-6">
              <label htmlFor="edit-termMonths" className="form-label">Term (Months) <small className="text-muted">(Optional)</small></label>
              <input type="number" className="form-control" id="edit-termMonths" name="termMonths" value={editedData.termMonths} onChange={handleEditChange} min="1" placeholder="N/A" disabled={isUpdating} />
            </div>
            <div className="col-md-6">
              <label htmlFor="edit-endDate" className="form-label">End Date <small className="text-muted">(Optional, overrides Term)</small></label>
              <input type="date" className="form-control" id="edit-endDate" name="endDate" value={editedData.endDate} onChange={handleEditChange} disabled={isUpdating} />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <div className="form-check form-switch mt-3">
                <input type="checkbox" className="form-check-input" id="edit-isActive" name="isActive" checked={editedData.isActive} onChange={handleEditChange} disabled={isUpdating} />
                <label className="form-check-label" htmlFor="edit-isActive">Active for Auto-Insertion</label>
              </div>
            </div>
          </div>
        </form>
      </ActionModal>
    </div>
  );
};

export default CommonExpenseCard;
