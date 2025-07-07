// src/pages/MonthlyIncomePage.jsx
import React, { useState } from 'react';
import useIncomeData from '../hooks/useIncomeData';
import IncomeList from '../components/Income/IncomeList';
import MonthlyIncomeSummary from '../components/Income/MonthlyIncomeSummary'; // <--- ENSURE THIS IMPORT IS PRESENT
import AddIncomeForm from '../components/Income/AddIncomeForm';
import ActionModal from '../components/Common/ActionModal';
import SkeletonLoader from '../components/Common/SkeletonLoader';

/**
 * Main page component for displaying and managing incomes.
 * It fetches grouped income data and allows adding, updating, and deleting incomes.
 */
const MonthlyIncomePage = () => {
  const {
    groupedIncomes,
    monthlyIncomeSummary, // Get monthly summary from hook
    currentYear,
    setCurrentYear,
    isLoading, // Global loading for initial/full fetches
    isAdding,   // Specific loading for add
    isUpdating, // Specific loading for update
    isDeleting, // Specific loading for delete
    error,
    recentlyAddedId,
    addIncome,
    updateIncomeItem,
    deleteIncomeItem,
    refetchIncomes, // For manual refetch if needed
  } = useIncomeData();

  const [showMonthlySummary, setShowMonthlySummary] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [incomeToDeleteId, setIncomeToDeleteId] = useState(null);

  // Handler for delete button click in IncomeListItem (triggers modal)
  const handleDeleteClick = (id) => {
    console.log('MonthlyIncomePage: handleDeleteClick called for ID:', id);
    setIncomeToDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handler for confirming delete in the modal
  const handleConfirmDelete = async () => {
    console.log('MonthlyIncomePage: handleConfirmDelete called for ID:', incomeToDeleteId);
    if (incomeToDeleteId) {
      try {
        await deleteIncomeItem(incomeToDeleteId); // This calls the hook's delete function
      } catch (error) {
        // Error toast is handled by useIncomeData
      } finally {
        setShowDeleteModal(false);
        setIncomeToDeleteId(null);
        console.log('MonthlyIncomePage: Delete confirmation flow finished.');
      }
    }
  };

  // Handler for canceling delete in the modal
  const handleCancelDelete = () => {
    console.log('MonthlyIncomePage: handleCancelDelete called.');
    setShowDeleteModal(false);
    setIncomeToDeleteId(null);
  };

  // Render loading state for the entire page
  if (isLoading) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-success">💰 Monthly Income Management</h2>
        <SkeletonLoader count={1} type="card" className="mb-4" /> {/* Skeleton for Add Form */}
        <div className="d-flex justify-content-end align-items-center mb-3">
          <SkeletonLoader count={1} type="text-line" className="w-25" /> {/* Skeleton for Year Selector */}
        </div>
        <SkeletonLoader count={3} type="card" /> {/* Skeletons for grouped income list */}
      </div>
    );
  }

  // Display error message
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading incomes: {error.message || 'Something went wrong.'}
        <p>Please check your browser console for more details and ensure your backend is running and CORS is configured correctly.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-success">💰 Monthly Income Management</h2>

      {/* Add Income Form - Disable if any CRUD operation is in progress */}
      <AddIncomeForm onAddIncome={addIncome} disabled={isAdding || isUpdating || isDeleting} />

      <div className="d-flex justify-content-end align-items-center mb-3">
        {/* Toggle Button for Views */}
        <button
          className="btn btn-outline-success me-3"
          onClick={() => setShowMonthlySummary(!showMonthlySummary)}
        >
          {showMonthlySummary ? 'Show Detailed Income List' : 'Show Monthly Income Summary'}
        </button>

        {/* Year Selector for filtering the grouped incomes */}
        <div className="d-flex align-items-center">
          <label htmlFor="incomeYear" className="form-label mb-0 me-2">Year:</label>
          <input
            type="number"
            id="incomeYear"
            className="form-control form-control-sm w-auto"
            value={currentYear}
            onChange={(e) => setCurrentYear(e.target.value)}
            min="2000"
            max={new Date().getFullYear() + 5}
            disabled={isAdding || isUpdating || isDeleting} // Disable during CRUD
          />
        </div>
      </div>

      {/* Render based on showMonthlySummary state */}
      {showMonthlySummary ? (
        // Show skeleton for summary if data is loading for it (e.g., year change)
        isLoading ? (
          <SkeletonLoader count={5} type="text-line" className="mt-4" />
        ) : (
          <MonthlyIncomeSummary // <--- THIS IS WHERE IT'S RENDERED
            monthlySummary={monthlyIncomeSummary}
            currentYear={currentYear}
          />
        )
      ) : (
        <IncomeList
          groupedIncomes={groupedIncomes}
          onDelete={handleDeleteClick}
          onUpdate={updateIncomeItem}
          recentlyAddedId={recentlyAddedId}
          isLoading={isLoading} // Pass global loading state
          isDeleting={isDeleting} // Pass specific deleting state
        />
      )}

      {/* Delete Confirmation Modal */}
      <ActionModal
        show={showDeleteModal}
        type="delete"
        title="Confirm Delete Income?"
        message="Are you sure you want to delete this income record? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        confirmButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        confirmButtonClass="btn-danger"
        cancelButtonClass="btn-secondary"
      />
    </div>
  );
};

export default MonthlyIncomePage;
