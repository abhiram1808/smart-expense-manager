import React, { useState } from 'react';
import useExpenseData from '../hooks/useExpenseData';
import ExpenseList from '../components/Expense/ExpenseList'; // Now the grouped list
import AddExpenseForm from '../components/Expense/AddExpenseForm'; // Assuming this is your add form
// import ActionModal from '../components/common/ActionModal'; // Removed if no delete confirmation
// import { toast } from 'react-toastify'; // Removed if no toasts are needed here

const ExpenseListPage = () => {
  const {
    groupedExpenses, // Get grouped expenses
    currentYear, // Get current year for filtering
    setCurrentYear, // Setter for current year
    loading,
    error,
    refetchExpenses, // Function to refetch data after CRUD
  } = useExpenseData();

  // Removed states and functions related to delete confirmation modal
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Removed handleUpdateExpense and handleDeleteConfirmation/confirmDelete/cancelDeleteModal
  // as CRUD operations are no longer handled by ExpenseList directly or confirmed via modal here.

  // Handle successful addition of an expense (from AddExpenseForm)
  const handleAddExpenseSuccess = () => {
    refetchExpenses(); // Refetch data to update the grouped list
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-2">Loading expenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading expenses: {error.message || 'Something went wrong.'}
        <p>Please check your browser console for more details and ensure your backend is running and CORS is configured correctly.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-danger">💸 Expense Management</h2>

      {/* Add Expense Form */}
      <AddExpenseForm onAddSuccess={handleAddExpenseSuccess} /> {/* Pass success handler */}

      <div className="d-flex justify-content-end align-items-center mb-3">
        {/* Year Selector for Grouped View */}
        <div className="d-flex align-items-center">
          <label htmlFor="expenseYear" className="form-label mb-0 me-2">Year:</label>
          <input
            type="number"
            id="expenseYear"
            className="form-control form-control-sm w-auto"
            value={currentYear}
            onChange={(e) => setCurrentYear(e.target.value)}
            min="2000"
            max={new Date().getFullYear() + 5}
          />
        </div>
      </div>

      {/* The main ExpenseList component (now grouped) */}
      <ExpenseList
        groupedExpenses={groupedExpenses} // Pass the grouped data
        // onDelete is no longer a prop of ExpenseList if ExpenseListItem doesn't use it
        // onUpdate is no longer a prop
        // recentlyAddedId is not directly used by ExpenseList, but passed to ExpenseListItem
      />

      {/* Removed Delete Confirmation Modal */}
      {/*
      <ActionModal
        show={showDeleteModal}
        type="delete"
        title="Confirm Delete Expense?"
        message="Are you sure you want to delete this expense entry? This action cannot be undone."
        onConfirm={confirmDelete}
        onClose={cancelDeleteModal}
      />
      */}
    </div>
  );
};

export default ExpenseListPage;
