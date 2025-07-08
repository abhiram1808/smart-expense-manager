// src/components/Expenses/ExpenseListItem.jsx
import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaSave, FaBan } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CategoryDropdown from '../Shared/CategoryDropdown'; // Reusing the CategoryDropdown

/**
 * Renders a single expense item in a table row, with inline editing capabilities.
 * @param {object} props - Component props.
 * @param {object} props.expense - The expense object to display.
 * @param {Function} props.onDelete - Callback for initiating a delete action.
 * @param {Function} props.onUpdate - Callback for updating an expense.
 * @param {boolean} props.isDeleting - Global state indicating if a delete operation is in progress.
 * @param {boolean} props.isUpdating - Global state indicating if an update operation is in progress.
 */
const ExpenseListItem = ({ expense, onDelete, onUpdate, isDeleting, isUpdating }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    category: expense.category,
    amount: expense.amount,
    date: new Date(expense.date).toISOString().split('T')[0], // Format date for input type="date"
    description: expense.description || '',
  });

  // Helper to format Date objects for display (e.g., "Jan 1, 2023")
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Client-side validation for edited data
    if (!editedData.category) {
      toast.error('Category cannot be empty.');
      return;
    }
    if (isNaN(parseFloat(editedData.amount)) || parseFloat(editedData.amount) <= 0) {
      toast.error('Amount must be a positive number.');
      return;
    }
    if (!editedData.date) {
      toast.error('Date is required.');
      return;
    }
    const parsedDate = new Date(editedData.date);
    if (isNaN(parsedDate.getTime())) {
      toast.error('Invalid date format.');
      return;
    }

    try {
      await onUpdate(expense._id, {
        ...editedData,
        amount: parseFloat(editedData.amount), // Ensure number type
        date: parsedDate, // Send as Date object, hook will convert to ISO string
      });
      setIsEditing(false); // Exit edit mode on successful update
    } catch (error) {
      // Error toast is handled by the useExpenses hook
      console.error("Error saving expense:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset edited data to original expense data
    setEditedData({
      category: expense.category,
      amount: expense.amount,
      date: new Date(expense.date).toISOString().split('T')[0],
      description: expense.description || '',
    });
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <CategoryDropdown
            id={`edit-category-${expense._id}`}
            name="category"
            value={editedData.category}
            onChange={handleEditChange}
            disabled={isUpdating}
            className="form-select form-select-sm"
          />
        ) : (
          expense.category
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            className="form-control form-control-sm"
            name="amount"
            value={editedData.amount}
            onChange={handleEditChange}
            step="0.01"
            disabled={isUpdating}
          />
        ) : (
          `₹${expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="date"
            className="form-control form-control-sm"
            name="date"
            value={editedData.date}
            onChange={handleEditChange}
            disabled={isUpdating}
          />
        ) : (
          formatDateForDisplay(expense.date)
        )}
      </td>
      <td>
        {isEditing ? (
          <textarea
            className="form-control form-control-sm"
            name="description"
            value={editedData.description}
            onChange={handleEditChange}
            rows="1"
            disabled={isUpdating}
          ></textarea>
        ) : (
          expense.description || 'N/A'
        )}
      </td>
      <td className="text-center text-nowrap">
        {isEditing ? (
          <>
            <button
              className="btn btn-sm btn-success me-2"
              onClick={handleSave}
              disabled={isUpdating}
              title="Save"
            >
              {isUpdating ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <FaSave />}
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={handleCancelEdit}
              disabled={isUpdating}
              title="Cancel"
            >
              <FaBan />
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-sm btn-primary me-2"
              onClick={() => setIsEditing(true)}
              disabled={isDeleting || isUpdating}
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(expense._id)} // Pass ID to parent for deletion
              disabled={isDeleting || isUpdating}
              title="Delete"
            >
              {isDeleting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <FaTrashAlt />}
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default ExpenseListItem;
