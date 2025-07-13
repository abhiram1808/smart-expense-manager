// client/src/components/DailyExpense/DailyExpenseList.jsx
import React, { useState } from 'react'; // Import useState
import useExpenses from '../../hooks/useExpenseData';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorDisplay from '../common/ErrorDisplay';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { deleteExpense } from '../../services/expenseService';
import ActionModal from '../common/ActionModal'; // <--- NEW: Import ActionModal

/**
 * Displays a list of recent daily expenses, filtered by a specific date.
 * @param {object} props - Component props.
 * @param {Function} props.onExpenseDeleted - Callback function to run after an expense is successfully deleted.
 * @param {Function} props.onEditClick - Callback to open the edit modal in the parent (DailyExpensesPage).
 * @param {string} props.filterDate - The date (YYYY-MM-DD) by which to filter expenses.
 */
const DailyExpenseList = ({ onExpenseDeleted, onEditClick, filterDate }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal
  const [expenseToDeleteId, setExpenseToDeleteId] = useState(null); // State to store ID of expense to delete

  const { expenses, isLoading, error, refetchExpenses } = useExpenses({
    startDate: filterDate,
    endDate: filterDate,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Handler to open the delete confirmation modal
  const handleDeleteClick = (id) => {
    setExpenseToDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handler for confirming deletion from the modal
  const handleConfirmDelete = async () => {
    if (!expenseToDeleteId) return; // Should not happen if modal is opened correctly

    try {
      await deleteExpense(expenseToDeleteId);
      toast.success('Expense deleted successfully!');
      refetchExpenses(); // Re-fetch the list after deletion
      if (onExpenseDeleted) {
        onExpenseDeleted(); // Notify parent (DailyExpensesPage) to update summary
      }
    } catch (err) {
      console.error('Error deleting expense:', err.response?.data || err.message);
      toast.error(`Failed to delete expense: ${err.response?.data?.error || err.message}`);
    } finally {
      setShowDeleteModal(false); // Close modal
      setExpenseToDeleteId(null); // Clear ID
    }
  };

  // Handler for closing the delete confirmation modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setExpenseToDeleteId(null);
  };

  if (isLoading) {
    return <SkeletonLoader count={5} type="table-row" />;
  }

  if (error) {
    return <ErrorDisplay error={error} message="Failed to load recent expenses." />;
  }

  if (expenses.length === 0) {
    return <p className="text-center text-muted py-4 mb-0">No expenses recorded for today. Add one above!</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>{expense.description}</td>
              <td>{expense.category}</td>
              <td>₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => onEditClick(expense)}
                  title="Edit Expense"
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteClick(expense._id)} 
                  title="Delete Expense"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <ActionModal
        show={showDeleteModal}
        type="delete"
        title="Confirm Delete Expense?"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteModal}
        confirmButtonText="Delete"
        confirmButtonClass="btn-danger"
        cancelButtonClass="btn-secondary"
      />
    </div>
  );
};

export default DailyExpenseList;
