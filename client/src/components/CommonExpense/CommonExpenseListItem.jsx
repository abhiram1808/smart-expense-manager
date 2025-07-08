// src/components/CommonExpenses/CommonExpenseListItem.jsx
import React, { useState, useMemo } from 'react';
import { FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaSave, FaBan } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CategoryDropdown from '../Shared/CategoryDropdown';

/**
 * Helper function to calculate the number of months between two dates.
 * Accounts for partial months.
 */
const getMonthsBetween = (d1, d2) => {
  if (!d1 || !d2) return 0;
  const date1 = new Date(d1);
  const date2 = new Date(d2);

  let months;
  months = (date2.getFullYear() - date1.getFullYear()) * 12;
  months -= date1.getMonth();
  months += date2.getMonth();
  // If the end day is before the start day, subtract a month
  if (date2.getDate() < date1.getDate()) {
    months--;
  }
  return months >= 0 ? months : 0;
};

/**
 * Renders a single common expense item in a table row, with inline editing capabilities.
 * @param {object} props - Component props.
 * @param {object} props.commonExpense - The common expense object to display.
 * @param {Function} props.onDelete - Callback for initiating a delete action.
 * @param {Function} props.onUpdate - Callback for updating an common expense.
 * @param {boolean} props.isDeleting - Global state indicating if a delete operation is in progress.
 * @param {boolean} props.isUpdating - Global state indicating if an update operation is in progress.
 */
const CommonExpenseListItem = ({ commonExpense, onDelete, onUpdate, isDeleting, isUpdating }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: commonExpense.name,
    category: commonExpense.category,
    amount: commonExpense.amount,
    dayOfMonth: commonExpense.dayOfMonth,
    startDate: commonExpense.startDate ? new Date(commonExpense.startDate).toISOString().split('T')[0] : '',
    endDate: commonExpense.endDate ? new Date(commonExpense.endDate).toISOString().split('T')[0] : '',
    termMonths: commonExpense.termMonths !== null ? commonExpense.termMonths : '', // Initialize with termMonths or empty string
    isActive: commonExpense.isActive,
  });

  // Memoized calculations for progress and amounts
  const { totalTermMonths, elapsedMonths, remainingMonths, progressPercentage, totalProjectedAmount, remainingProjectedAmount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    const startDate = commonExpense.startDate ? new Date(commonExpense.startDate) : null;
    let calculatedEndDate = commonExpense.endDate ? new Date(commonExpense.endDate) : null;
    let totalTerm = commonExpense.termMonths;

    // If termMonths is not explicitly set, try to derive it from startDate and endDate
    if (totalTerm === null && startDate && calculatedEndDate) {
        totalTerm = getMonthsBetween(startDate, calculatedEndDate);
    } else if (totalTerm !== null && startDate && !calculatedEndDate) {
        // If termMonths is set but endDate isn't, calculate endDate for display consistency
        calculatedEndDate = new Date(startDate);
        calculatedEndDate.setMonth(startDate.getMonth() + totalTerm);
        calculatedEndDate.setDate(startDate.getDate()); // Keep the same day of month
        calculatedEndDate.setHours(0, 0, 0, 0); // Normalize to start of day
    }


    const effectiveStartDate = startDate;
    const effectiveEndDate = calculatedEndDate; // Use the calculated or provided endDate

    let elapsed = 0;
    let remaining = 0;
    let progress = 0;
    let totalProjAmount = 0;
    let remainingProjAmount = 0;

    if (effectiveStartDate) {
        if (totalTerm !== null) { // Fixed term expense
            elapsed = getMonthsBetween(effectiveStartDate, today);
            if (elapsed < 0) elapsed = 0; // If start date is in future

            remaining = totalTerm - elapsed;
            if (remaining < 0) remaining = 0; // Don't show negative remaining months

            progress = totalTerm > 0 ? (elapsed / totalTerm) * 100 : 0;
            if (progress > 100) progress = 100; // Cap at 100%

            totalProjAmount = commonExpense.amount * totalTerm;
            remainingProjAmount = commonExpense.amount * remaining;

        } else if (effectiveEndDate) { // Indefinite but with an end date
            totalTerm = getMonthsBetween(effectiveStartDate, effectiveEndDate);
            if (totalTerm < 0) totalTerm = 0; // Handle end date before start date

            elapsed = getMonthsBetween(effectiveStartDate, today);
            if (elapsed < 0) elapsed = 0;

            remaining = totalTerm - elapsed;
            if (remaining < 0) remaining = 0;

            progress = totalTerm > 0 ? (elapsed / totalTerm) * 100 : 0;
            if (progress > 100) progress = 100;

            totalProjAmount = commonExpense.amount * totalTerm;
            remainingProjAmount = commonExpense.amount * remaining;

        } else { // Truly indefinite (no termMonths, no endDate)
            // For indefinite, we can show total amount as just the monthly amount
            // and remaining as current month's amount, or simply N/A for totals.
            // For progress, it's always 0% or N/A.
            totalTerm = 'Indefinite'; // Display string
            elapsed = 'N/A';
            remaining = 'N/A';
            progress = 0; // Or N/A, but 0 makes progress bar work
            totalProjAmount = 'N/A'; // Or commonExpense.amount for a single month
            remainingProjAmount = 'N/A'; // Or commonExpense.amount for a single month
        }
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

    // Special handling for termMonths and endDate to ensure only one is primarily used
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
    // Client-side validation
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

    // Final validation for endDate vs termMonths logic
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
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving common expense:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
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

  const dayOfMonthOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <tr>
      <td>
        {isEditing ? (
          <input type="text" className="form-control form-control-sm" name="name" value={editedData.name} onChange={handleEditChange} disabled={isUpdating} />
        ) : (
          commonExpense.name
        )}
      </td>
      <td>
        {isEditing ? (
          <CategoryDropdown id="edit-category" name="category" value={editedData.category} onChange={handleEditChange} disabled={isUpdating} className="form-select form-select-sm" />
        ) : (
          commonExpense.category
        )}
      </td>
      <td>
        {isEditing ? (
          <input type="number" className="form-control form-control-sm" name="amount" value={editedData.amount} onChange={handleEditChange} step="0.01" disabled={isUpdating} />
        ) : (
          `₹${commonExpense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        )}
      </td>
      <td>
        {isEditing ? (
          <select className="form-select form-select-sm" name="dayOfMonth" value={editedData.dayOfMonth} onChange={handleEditChange} disabled={isUpdating}>
            {dayOfMonthOptions.map((day) => (<option key={day} value={day}>{day}</option>))}
          </select>
        ) : (
          commonExpense.dayOfMonth
        )}
      </td>
      <td>
        {isEditing ? (
          <input type="date" className="form-control form-control-sm" name="startDate" value={editedData.startDate} onChange={handleEditChange} disabled={isUpdating} />
        ) : (
          formatDateForDisplay(commonExpense.startDate)
        )}
      </td>
      <td>
        {isEditing ? (
          <input type="number" className="form-control form-control-sm" name="termMonths" value={editedData.termMonths} onChange={handleEditChange} min="1" placeholder="N/A" disabled={isUpdating} />
        ) : (
          commonExpense.termMonths || 'N/A'
        )}
      </td>
      <td>
        {isEditing ? (
          <input type="date" className="form-control form-control-sm" name="endDate" value={editedData.endDate} onChange={handleEditChange} disabled={isUpdating} />
        ) : (
          formatDateForDisplay(commonExpense.endDate)
        )}
      </td>
      <td>
        {totalTermMonths !== 'Indefinite' ? (
          <>
            <div className="progress" style={{ height: '20px', backgroundColor: '#e9ecef' }}>
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
            <small className="text-muted mt-1 d-block">
                {elapsedMonths} / {totalTermMonths} Months
            </small>
          </>
        ) : (
          <span className="badge bg-secondary">Indefinite</span>
        )}
      </td>
      <td>
        {totalProjectedAmount !== 'N/A' ? (
          `₹${totalProjectedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ) : (
          'N/A'
        )}
      </td>
      <td>
        {remainingProjectedAmount !== 'N/A' ? (
          `₹${remainingProjectedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        ) : (
          'N/A'
        )}
      </td>
      <td className="text-center">
        {isEditing ? (
          <div className="form-check form-switch d-inline-block">
            <input type="checkbox" className="form-check-input" id={`isActive-${commonExpense._id}`} name="isActive" checked={editedData.isActive} onChange={handleEditChange} disabled={isUpdating} />
          </div>
        ) : (
          commonExpense.isActive ? <FaCheckCircle className="text-success" title="Active" /> : <FaTimesCircle className="text-danger" title="Inactive" />
        )}
      </td>
      <td>{formatDateForDisplay(commonExpense.lastInsertedDate)}</td>
      <td className="text-center text-nowrap">
        {isEditing ? (
          <>
            <button className="btn btn-sm btn-success me-2" onClick={handleSave} disabled={isUpdating} title="Save">
              {isUpdating ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <FaSave />}
            </button>
            <button className="btn btn-sm btn-secondary" onClick={handleCancelEdit} disabled={isUpdating} title="Cancel">
              <FaBan />
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-sm btn-primary me-2" onClick={() => setIsEditing(true)} disabled={isDeleting || isUpdating} title="Edit">
              <FaEdit />
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(commonExpense._id)} disabled={isDeleting || isUpdating} title="Delete">
              {isDeleting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <FaTrashAlt />}
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default CommonExpenseListItem;
