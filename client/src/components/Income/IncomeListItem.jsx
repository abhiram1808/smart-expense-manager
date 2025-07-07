// src/components/Income/IncomeListItem.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

/**
 * Represents a single income item row in the list, with inline editing and delete functionality.
 * @param {object} props - Component props.
 * @param {object} props.income - The income object.
 * @param {Function} props.onDelete - Callback to trigger delete confirmation in parent.
 * @param {Function} props.onUpdate - Callback to trigger update in parent.
 * @param {string} props.recentlyAddedId - ID of the recently added income for highlight.
 * @param {boolean} props.isDeleting - Global state indicating if a delete operation is in progress.
 */
const IncomeListItem = ({ income, onDelete, onUpdate, recentlyAddedId, isDeleting }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSource, setEditedSource] = useState(income.source || '');
  const [editedAmount, setEditedAmount] = useState(income.amount || 0);
  const [editedDate, setEditedDate] = useState(
    income.date ? new Date(income.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  ); // Format date for input type="date"

  // Effect to reset editing state if the income prop changes (e.g., after a successful update)
  useEffect(() => {
    setIsEditing(false);
    setEditedSource(income.source || '');
    setEditedAmount(income.amount || 0);
    setEditedDate(
      income.date ? new Date(income.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
    );
  }, [income]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Reset to original values
    setEditedSource(income.source || '');
    setEditedAmount(income.amount || 0);
    setEditedDate(
      income.date ? new Date(income.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
    );
  };

  const handleSaveClick = async () => {
    // Basic validation
    if (!editedSource.trim() || !editedAmount || !editedDate) {
      toast.error('Source, Amount, and Date cannot be empty.');
      return;
    }
    const parsedAmount = parseFloat(editedAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Amount must be a positive number.');
      return;
    }

    try {
      await onUpdate({
        _id: income._id,
        source: editedSource,
        amount: parsedAmount,
        date: editedDate,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving income item:", error);
    }
  };

  // Display values
  const displayAmount = typeof income.amount === 'number' && !isNaN(income.amount)
    ? income.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  let displayDate = 'N/A';
  if (income.date) {
    const dateObj = new Date(income.date);
    if (!isNaN(dateObj.getTime())) {
      displayDate = dateObj.toLocaleDateString();
    } else {
      console.warn('IncomeListItem: Invalid date format for income.date:', income.date, 'Full income:', income);
    }
  }

  return (
    <tr className={recentlyAddedId === income._id ? 'table-warning animate__animated animate__flash' : ''}>
      <td>
        {isEditing ? (
          <input
            type="text"
            className="form-control form-control-sm"
            value={editedSource}
            onChange={(e) => setEditedSource(e.target.value)}
          />
        ) : (
          income.source
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            className="form-control form-control-sm"
            value={editedAmount}
            onChange={(e) => setEditedAmount(e.target.value)}
            step="0.01"
          />
        ) : (
          `₹${displayAmount}`
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="date"
            className="form-control form-control-sm"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
          />
        ) : (
          displayDate
        )}
      </td>
      <td className="text-center">
        <div className="d-flex gap-2 justify-content-center">
          {isEditing ? (
            <>
              <button
                className="btn btn-sm btn-success"
                onClick={handleSaveClick}
                title="Save Changes"
                disabled={isDeleting} // Disable save if another delete is in progress
              >
                <FaCheck />
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleCancelClick}
                title="Cancel Editing"
                disabled={isDeleting} // Disable cancel if another delete is in progress
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleEditClick}
                title="Edit Income"
                disabled={isDeleting} // Disable edit if another delete is in progress
              >
                <FaEdit />
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(income._id)}
                title="Delete Income"
                disabled={isDeleting} // Disable delete if any delete is in progress
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default IncomeListItem;
