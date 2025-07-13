// client/src/components/CommonExpense/CommonExpenseListItem.jsx
import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import ActionModal from '../common/ActionModal';
import { toast } from 'react-toastify';

/**
 * Displays a single common expense item (recurring template) and allows editing/deleting.
 * @param {object} props - Component props.
 * @param {object} props.item - The common expense item (recurring template) data.
 * @param {Function} props.onUpdate - Callback to update the item.
 * @param {Function} props.onDelete - Callback to delete the item.
 * @param {boolean} props.isUpdating - Loading state for update.
 * @param {boolean} props.isDeleting - Loading state for delete.
 * @param {Array<string>} props.uniqueCategories - List of existing categories for dropdown.
 * @param {Function} props.onEditClick - Callback to open the edit modal in the parent (CommonExpensesPage).
 * @param {Function} props.onToggleActive - Callback to toggle active status.
 */
const CommonExpenseListItem = ({ item, onUpdate, onDelete, isUpdating, isDeleting, uniqueCategories, onEditClick, onToggleActive }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Defensive check: if item is null or undefined, render nothing or a placeholder
  if (!item) {
    console.warn("CommonExpenseListItem received an undefined or null item prop.");
    return null; // Or return a loading spinner/placeholder
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete(item._id);
    } catch (error) {
      // Error handled by the hook/service
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Determine if the item is recurring based on termMonths or endDate
  const isRecurring = item.termMonths !== null || item.endDate !== null;

  return (
    <tr>
      <td>{item.name}</td>
      <td>₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>{item.category}</td>
      <td>{item.dayOfMonth}</td>
      <td>{item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'}</td>
      <td>{item.termMonths !== null ? item.termMonths : 0}</td>
      <td>{item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Never'}</td>
      <td>{isRecurring ? 'Yes' : 'No'}</td>
      <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'}</td>
      <td>
        <button
          className={`btn btn-sm ${item.isActive ? 'btn-success' : 'btn-warning'}`}
          onClick={() => onToggleActive(item._id, item.isActive)}
          disabled={isUpdating || isDeleting}
          title={item.isActive ? 'Click to Pause' : 'Click to Activate'}
        >
          {item.isActive ? <FaToggleOn /> : <FaToggleOff />}
          {item.isActive ? ' Active' : ' Paused'}
        </button>
      </td>
      <td>
        <button
          className="btn btn-sm btn-primary me-2"
          onClick={() => onEditClick(item)}
          disabled={isUpdating || isDeleting}
          title="Edit Template"
        >
          <FaEdit />
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={handleDeleteClick}
          disabled={isUpdating || isDeleting}
          title="Delete Template"
        >
          <FaTrashAlt />
        </button>
      </td>

      {/* Delete Confirmation Modal */}
      <ActionModal
        show={showDeleteModal}
        type="delete"
        title="Confirm Delete Recurring Expense Template?"
        message={`Are you sure you want to delete "${item.name}"? This will stop future automatic insertions.`}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteModal}
        confirmButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        confirmButtonClass="btn-danger"
        cancelButtonClass="btn-secondary"
      />
    </tr>
  );
};

export default CommonExpenseListItem;
