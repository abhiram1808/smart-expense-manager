// src/pages/MonthlyBudgetPage.jsx
import React, { useState } from 'react';
import useBudget from '../hooks/useBudgetData';
import AddBudgetForm from '../components/Budget/AddBudgetForm';
import BudgetList from '../components/Budget/BudgetList';
import ActionModal from '../components/common/ActionModal';
import SkeletonLoader from '../components/Common/SkeletonLoader';
import ErrorDisplay from '../components/Common/ErrorDisplay'; // <--- Import the new ErrorDisplay

/**
 * Main page component for displaying and managing monthly budgets.
 * It fetches budgets for a selected year, grouped by month, and allows adding, updating, and deleting budgets.
 */
const MonthlyBudgetPage = () => {
  const {
    groupedBudgets,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    error, // <--- This error state is what we'll display
    addBudget,
    updateBudgetItem,
    deleteBudgetItem,
    refetchBudgets,
  } = useBudget();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [budgetToDeleteId, setBudgetToDeleteId] = useState(null);

  // Handler for delete button click in BudgetListItem (triggers modal)
  const handleDeleteClick = (id) => {
    console.log('MonthlyBudgetPage: handleDeleteClick called for ID:', id);
    setBudgetToDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handler for confirming delete in the modal
  const handleConfirmDelete = async () => {
    console.log('MonthlyBudgetPage: handleConfirmDelete called for ID:', budgetToDeleteId);
    if (budgetToDeleteId) {
      try {
        await deleteBudgetItem(budgetToDeleteId);
      } catch (error) {
        // Error toast is handled by useBudget hook
      } finally {
        setShowDeleteModal(false);
        setBudgetToDeleteId(null);
        console.log('MonthlyBudgetPage: Delete confirmation flow finished.');
      }
    }
  };

  // Handler for canceling delete in the modal
  const handleCancelDelete = () => {
    console.log('MonthlyBudgetPage: handleCancelDelete called.');
    setShowDeleteModal(false);
    setBudgetToDeleteId(null);
  };

  // Month and Year options for selectors (Year for list, Month for add form default)
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1).map(monthNum => ({
    value: monthNum,
    label: new Date(new Date().getFullYear(), monthNum - 1, 1).toLocaleString('default', { month: 'long' })
  }));
  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i); // Current year +/- 2

  // Render loading state for the entire page
  if (isLoading) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary">📊 Monthly Budget Management</h2>
        <SkeletonLoader count={1} type="card" className="mb-4" /> {/* Skeleton for Add Form */}
        <div className="d-flex justify-content-end align-items-center mb-3">
          <SkeletonLoader count={1} type="text-line" className="w-50" /> {/* Skeleton for Year Selector */}
        </div>
        <SkeletonLoader count={3} type="card" /> {/* Skeletons for grouped budget list */}
      </div>
    );
  }

  // Display error message using the new ErrorDisplay component
  if (error) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary">📊 Monthly Budget Management</h2>
        <ErrorDisplay
          error={error}
          message="Failed to load budget data."
        />
        <p className="text-center mt-3">Please ensure your backend server is running and accessible.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary">📊 Monthly Budget Management</h2>

      {/* Add Budget Form */}
      <AddBudgetForm onAddBudget={addBudget} disabled={isAdding || isUpdating || isDeleting} />

      <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
        {/* Year Selector for the main grouped list view */}
        <div className="d-flex align-items-center">
          <label htmlFor="budgetYear" className="form-label mb-0 me-2">View Year:</label>
          <select
            id="budgetYear"
            className="form-select form-select-sm w-auto"
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            disabled={isAdding || isUpdating || isDeleting}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Budget List - now receives groupedBudgets */}
      <BudgetList
        groupedBudgets={groupedBudgets}
        onDelete={handleDeleteClick}
        onUpdate={updateBudgetItem}
        isLoading={isLoading} // Pass global loading state
        isDeleting={isDeleting}
        isUpdating={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <ActionModal
        show={showDeleteModal}
        type="delete"
        title="Confirm Delete Budget?"
        message="Are you sure you want to delete this budget record? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        confirmButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        confirmButtonClass="btn-danger"
        cancelButtonClass="btn-secondary"
      />
    </div>
  );
};

export default MonthlyBudgetPage;
