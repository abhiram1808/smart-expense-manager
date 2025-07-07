// src/components/Budget/BudgetListItem.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

/**
 * Represents a single budget item row in the list, with inline editing and delete functionality.
 * @param {object} props - Component props.
 * @param {object} props.budget - The budget object.
 * @param {Function} props.onDelete - Callback to trigger delete confirmation in parent.
 * @param {Function} props.onUpdate - Callback to trigger update in parent.
 * @param {boolean} props.isDeleting - Global state indicating if a delete operation is in progress.
 * @param {boolean} props.isUpdating - Global state indicating if an update operation is in progress.
 */
const BudgetListItem = ({ budget, onDelete, onUpdate, isDeleting, isUpdating }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(budget.amount || 0);

  // Effect to reset editing state if the budget prop changes (e.g., after a successful update)
  useEffect(() => {
    setIsEditing(false);
    setEditedAmount(budget.amount || 0);
  }, [budget]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedAmount(budget.amount || 0); // Reset to original amount
  };

  const handleSaveClick = async () => {
    // Basic validation
    if (!editedAmount) {
      toast.error('Amount cannot be empty.');
      return;
    }
    const parsedAmount = parseFloat(editedAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Amount must be a positive number.');
      return;
    }

    try {
      await onUpdate(budget._id, { amount: parsedAmount }); // Only amount is typically updated inline
      setIsEditing(false); // Only close editing if update is successful
    } catch (error) {
      console.error("Error saving budget item:", error);
      // Toast error handled by useBudget hook
    }
  };

  const displayAmount = typeof budget.amount === 'number' && !isNaN(budget.amount)
    ? budget.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  const monthNames = [
    'January', 'February', 'März', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const displayMonth = budget.month ? monthNames[budget.month - 1] : 'N/A';

  return (
    <tr>
      <td>{budget.category}</td>
      <td>
        {isEditing ? (
          <input
            type="number"
            className="form-control form-control-sm"
            value={editedAmount}
            onChange={(e) => setEditedAmount(e.target.value)}
            step="0.01"
            disabled={isUpdating} // Disable input during update
          />
        ) : (
          `₹${displayAmount}`
        )}
      </td>
      <td>{displayMonth}</td>
      <td>{budget.year}</td>
      <td className="text-center">
        <div className="d-flex gap-2 justify-content-center">
          {isEditing ? (
            <>
              <button
                className="btn btn-sm btn-success"
                onClick={handleSaveClick}
                title="Save Changes"
                disabled={isUpdating} // Disable save button during update
              >
                <FaCheck />
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleCancelClick}
                title="Cancel Editing"
                disabled={isUpdating} // Disable cancel button during update
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleEditClick}
                title="Edit Budget"
                disabled={isDeleting || isUpdating} // Disable edit if deleting or updating
              >
                <FaEdit />
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(budget._id)}
                title="Delete Budget"
                disabled={isDeleting || isUpdating} // Disable delete if deleting or updating
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

export default BudgetListItem;
