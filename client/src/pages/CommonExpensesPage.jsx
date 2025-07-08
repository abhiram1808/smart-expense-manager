// src/pages/CommonExpensesPage.jsx
import React, { useState } from 'react';
import useCommonExpenses from '../hooks/useCommonExpenseData'; // Import the hook
import AddCommonExpenseForm from '../components/CommonExpense/AddCommonExpenseForm';
import CommonExpenseList from '../components/CommonExpense/CommonExpenseList';
import ActionModal from '../components/common/ActionModal'; // Reusing ActionModal for delete confirmation
import SkeletonLoader from '../components/common/SkeletonLoader';
import ErrorDisplay from '../components/common/ErrorDisplay';

/**
 * Main page component for managing common (recurring) expenses.
 * Allows users to add, view, update, and delete recurring expense definitions.
 */
const CommonExpensesPage = () => {
  const {
    commonExpenses,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    error,
    addCommonExpense,
    updateCommonExpenseItem,
    deleteCommonExpenseItem,
    // In case you need to manually refresh the list
  } = useCommonExpenses();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commonExpenseToDeleteId, setCommonExpenseToDeleteId] = useState(null);

  // Handler for delete button click in CommonExpenseListItem (triggers modal)
  const handleDeleteClick = (id) => {
    console.log('CommonExpensesPage: handleDeleteClick called for ID:', id);
    setCommonExpenseToDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handler for confirming delete in the modal
  const handleConfirmDelete = async () => {
    console.log('CommonExpensesPage: handleConfirmDelete called for ID:', commonExpenseToDeleteId);
    if (commonExpenseToDeleteId) {
      try {
        await deleteCommonExpenseItem(commonExpenseToDeleteId);
      } catch (error) {
        // Error toast is handled by useCommonExpenses hook
        console.error('CommonExpensesPage: Error during delete confirmation:', error);
      } finally {
        setShowDeleteModal(false);
        setCommonExpenseToDeleteId(null);
        console.log('CommonExpensesPage: Delete confirmation flow finished.');
      }
    }
  };

  // Handler for canceling delete in the modal
  const handleCancelDelete = () => {
    console.log('CommonExpensesPage: handleCancelDelete called.');
    setShowDeleteModal(false);
    setCommonExpenseToDeleteId(null);
  };

  // Render loading state for the entire page
  if (isLoading) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-success">🔄 Recurring Expenses Management</h2>
        <SkeletonLoader count={1} type="card" className="mb-4" /> {/* Skeleton for Add Form */}
        <SkeletonLoader count={5} type="table-row" /> {/* Skeletons for list */}
      </div>
    );
  }

  // Display error message
  if (error) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-success">🔄 Recurring Expenses Management</h2>
        <ErrorDisplay
          error={error}
          message="Failed to load recurring expenses."
        />
        <p className="text-center mt-3">Please ensure your backend server is running and accessible.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-success">🔄 Recurring Expenses Management</h2>

      {/* Add Common Expense Form */}
      <AddCommonExpenseForm onAddCommonExpense={addCommonExpense} disabled={isAdding || isUpdating || isDeleting} />

      {/* Common Expense List */}
      <CommonExpenseList
        commonExpenses={commonExpenses}
        onDelete={handleDeleteClick}
        onUpdate={updateCommonExpenseItem}
        isLoading={isLoading} // Pass global loading state
        isDeleting={isDeleting}
        isUpdating={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <ActionModal
        show={showDeleteModal}
        type="delete"
        title="Confirm Delete Recurring Expense?"
        message="Are you sure you want to delete this recurring expense definition? This will stop future auto-insertions for this item."
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        confirmButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        confirmButtonClass="btn-danger"
        cancelButtonClass="btn-secondary"
      />
    </div>
  );
};

export default CommonExpensesPage;
