// src/pages/ExpenseListPage.jsx
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import useExpenses from '../hooks/useExpenseData';
import AddExpenseForm from '../components/Expense/AddExpenseForm';
import ExpenseList from '../components/Expense/ExpenseList';
import ActionModal from '../components/common/ActionModal';
import ErrorDisplay from '../components/common/ErrorDisplay';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { toast } from 'react-toastify';

/**
 * Component for filtering and sorting expenses.
 * This will be integrated directly into ExpenseListPage.
 * @param {object} props - Component props.
 * @param {Function} props.onFilterChange - Callback when filters change: (filters: object) => void
 * @param {Function} props.onSortChange - Callback when sort changes: (sortBy: string) => void
 * @param {Function} props.onSortOrderChange - Callback when sort order changes: (sortOrder: string) => void
 * @param {Array<Object>} props.expenses - The full list of expenses to extract unique categories.
 */
const ExpenseFilters = ({ onFilterChange, onSortChange, onSortOrderChange, expenses }) => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Refs to store previous filter/sort states for comparison
  const prevFiltersRef = useRef({});
  const prevSortByRef = useRef('date');
  const prevSortOrderRef = useRef('desc');

  // Dynamically get unique categories and years from expenses
  const uniqueCategories = [
    '', // Option for 'All Categories'
    ...new Set(expenses.map(exp => exp.category))
  ].sort();

  const uniqueYears = [
    '', // Option for 'All Years'
    ...new Set(expenses.map(exp => exp.year))
  ].sort((a, b) => b - a); // Sort years descending

  const months = [
    { value: '', label: 'All Months' }, { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' }, { value: 5, label: 'May' },
    { value: 6, label: 'June' }, { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' }, { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Effect to trigger filter change when local states update
  useEffect(() => {
    const currentFilters = {};
    if (categoryFilter) currentFilters.category = categoryFilter;
    if (monthFilter) currentFilters.month = monthFilter;
    if (yearFilter) currentFilters.year = yearFilter;
    if (startDateFilter) currentFilters.startDate = startDateFilter;
    if (endDateFilter) currentFilters.endDate = endDateFilter;

    // Only call onFilterChange if the filters have actually changed content
    if (JSON.stringify(currentFilters) !== JSON.stringify(prevFiltersRef.current)) {
      if (typeof onFilterChange === 'function') {
        onFilterChange(currentFilters);
      }
      prevFiltersRef.current = currentFilters; // Update the ref
    }
  }, [categoryFilter, monthFilter, yearFilter, startDateFilter, endDateFilter, onFilterChange]);

  // Effect to trigger sort change when local states update
  useEffect(() => {
    if (sortBy !== prevSortByRef.current) {
      if (typeof onSortChange === 'function') {
        onSortChange(sortBy);
      }
      prevSortByRef.current = sortBy; // Update the ref
    }
  }, [sortBy, onSortChange]);

  useEffect(() => {
    if (sortOrder !== prevSortOrderRef.current) {
      if (typeof onSortOrderChange === 'function') {
        onSortOrderChange(sortOrder);
      }
      prevSortOrderRef.current = sortOrder; // Update the ref
    }
  }, [sortOrder, onSortOrderChange]);

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-light d-flex align-items-center" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0 text-dark me-3">Filter & Sort Expenses</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="filterCategory" className="form-label">Category</label>
            <select
              className="form-select"
              id="filterCategory"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {uniqueCategories.map(cat => (
                <option key={cat || 'all'} value={cat}>{cat || 'All Categories'}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="filterMonth" className="form-label">Month</label>
            <select
              className="form-select"
              id="filterMonth"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="filterYear" className="form-label">Year</label>
            <select
              className="form-select"
              id="filterYear"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              {uniqueYears.map(y => (
                <option key={y || 'all'} value={y}>{y || 'All Years'}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="filterStartDate" className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              id="filterStartDate"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="filterEndDate" className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              id="filterEndDate"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="sortBy" className="form-label">Sort By</label>
            <select
              className="form-select"
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="sortOrder" className="form-label">Order</label>
            <select
              className="form-select"
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};


/**
 * Consolidated page for adding and listing expenses.
 * Users can add new expenses via a form and view/manage existing ones in a list.
 * Includes filtering and sorting capabilities for the expense list.
 */
const ExpenseListPage = () => {
  const {
    expenses,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    error,
    addExpense,
    updateExpenseItem,
    deleteExpenseItem,
    setFilters,
    setSortBy,
    setSortOrder,
  } = useExpenses();

  console.log('ExpenseListPage: Component rendered. isLoading:', isLoading, 'expenses count:', expenses.length);
  console.log('ExpenseListPage: Current expenses array received from hook:', expenses);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDeleteId, setExpenseToDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    console.log('ExpenseListPage: handleDeleteClick called for ID:', id);
    setExpenseToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    console.log('ExpenseListPage: handleConfirmDelete called for ID:', expenseToDeleteId);
    if (expenseToDeleteId) {
      try {
        await deleteExpenseItem(expenseToDeleteId);
      } catch (error) {
        // Error toast is handled by useExpenses hook
      } finally {
        setShowDeleteModal(false);
        setExpenseToDeleteId(null);
        console.log('ExpenseListPage: Delete confirmation flow finished.');
      }
    }
  };

  const handleCancelDelete = () => {
    console.log('ExpenseListPage: handleCancelDelete called.');
    setShowDeleteModal(false);
    setExpenseToDeleteId(null);
  };

  if (isLoading && !isAdding && !isUpdating && !isDeleting) {
    console.log('ExpenseListPage: Displaying skeleton loader due to isLoading: true');
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary">💰 Your Expenses</h2>
        <SkeletonLoader count={1} type="card" className="mb-4" />
        <SkeletonLoader count={1} type="card" className="mb-4" />
        <SkeletonLoader count={5} type="table-row" />
      </div>
    );
  }

  if (error) {
    console.log('ExpenseListPage: Displaying error due to error state:', error);
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary">💰 Your Expenses</h2>
        <ErrorDisplay
          error={error}
          message="Failed to load expenses."
        />
        <p className="text-center mt-3">Please ensure your backend server is running and accessible.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary">💰 Your Expenses</h2>

      {/* Add Expense Form */}
      <AddExpenseForm onAddExpense={addExpense} disabled={isAdding || isUpdating || isDeleting} />

      {/* Expense Filters */}
      <ExpenseFilters
        onFilterChange={setFilters}
        onSortChange={setSortBy}
        onSortOrderChange={setSortOrder}
        expenses={expenses}
      />

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        onDelete={handleDeleteClick}
        onUpdate={updateExpenseItem}
        isLoading={isLoading}
        isDeleting={isDeleting}
        isUpdating={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <ActionModal
        show={showDeleteModal}
        type="delete"
        title="Confirm Delete Expense?"
        message="Are you sure you want to delete this expense record? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        confirmButtonText={isDeleting ? 'Deleting...' : 'Delete'}
        confirmButtonClass="btn-danger"
        cancelButtonClass="btn-secondary"
      />
    </div>
  );
};

export default ExpenseListPage;
