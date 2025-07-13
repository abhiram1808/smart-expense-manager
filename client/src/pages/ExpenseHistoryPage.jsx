// client/src/pages/ExpenseHistoryPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  FaHistory, FaFilter, FaSort, FaChevronLeft, FaChevronRight,
  FaEdit, FaTrashAlt // Ensure these are correctly imported for the action buttons
} from 'react-icons/fa';
import useExpenses from '../hooks/useExpenseData';
import CategoryDropdown from '../components/Shared/CategoryDropdown';
import ErrorDisplay from '../components/common/ErrorDisplay';
import SkeletonLoader from '../components/common/SkeletonLoader';
import ActionModal from '../components/common/ActionModal';
import { updateExpense, deleteExpense } from '../services/expenseService';
import { toast } from 'react-toastify';

/**
 * Page component to display a comprehensive history of all expenses,
 * with filtering, sorting, and pagination options.
 */
const ExpenseHistoryPage = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Month is 0-indexed in JS Date, 1-indexed for backend

  // State for filters - Default to current month and year
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMonth, setFilterMonth] = useState(currentMonth.toString());
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [filterStartDate, setFilterStartDate] = useState(''); // Kept for potential future use or if user adds it back
  const [filterEndDate, setFilterEndDate] = useState('');     // Kept for potential future use or if user adds it back

  // State for sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // State for pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Use the enhanced useExpenses hook with all parameters
  const {
    expenses,
    isLoading,
    error,
    refetchExpenses,
    totalCount,
    totalPages,
    updateParams,
  } = useExpenses({
    page: currentPage,
    limit: itemsPerPage,
    sortBy,
    sortOrder,
    category: filterCategory || undefined,
    month: filterMonth ? parseInt(filterMonth) : undefined,
    year: filterYear ? parseInt(filterYear) : undefined,
    startDate: filterStartDate || undefined,
    endDate: filterEndDate || undefined,
  });

  // States for Edit/Delete Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDate, setEditDate] = useState('');
  const [isUpdatingExpense, setIsUpdatingExpense] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDeleteId, setExpenseToDeleteId] = useState(null);

  // Options for filter dropdowns
  const years = useMemo(() => {
    const startYear = currentYear - 5;
    const endYear = currentYear + 1;
    const yearOptions = [];
    for (let i = startYear; i <= endYear; i++) {
      yearOptions.push(i);
    }
    return ['', ...yearOptions.sort((a, b) => b - a)];
  }, [currentYear]);

  const months = useMemo(() => {
    return [
      '', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }, []);

  // Effect to update params when filter/sort/pagination states change
  useEffect(() => {
    updateParams({
      page: currentPage,
      limit: itemsPerPage,
      sortBy,
      sortOrder,
      category: filterCategory || undefined,
      month: filterMonth ? parseInt(filterMonth) : undefined,
      year: filterYear ? parseInt(filterYear) : undefined,
      startDate: filterStartDate || undefined,
      endDate: filterEndDate || undefined,
    });
  }, [
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
    filterCategory,
    filterMonth,
    filterYear,
    filterStartDate,
    filterEndDate,
    updateParams // updateParams is stable due to useCallback in useExpenseData
  ]);


  // Handle Edit/Delete actions
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setEditDescription(expense.description || '');
    setEditAmount(expense.amount || '');
    setEditCategory(expense.category || '');
    setEditDate(new Date(expense.date).toISOString().split('T')[0] || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editAmount || !editCategory || !editDate) {
      toast.error('Please fill all required fields for editing (Amount, Category, Date).');
      return;
    }

    setIsUpdatingExpense(true);
    try {
      const updatedExpenseData = {
        description: editDescription.trim() || '',
        amount: parseFloat(editAmount),
        category: editCategory,
        date: editDate,
      };
      await updateExpense(editingExpense._id, updatedExpenseData);
      toast.success('Expense updated successfully!');
      setShowEditModal(false);
      setEditingExpense(null);
      refetchExpenses(); // Re-fetch expenses after update
    } catch (err) {
      console.error('Error updating expense:', err.response?.data || err.message);
      toast.error(`Failed to update expense: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsUpdatingExpense(false);
    }
  };

  const handleDeleteClick = (id) => {
    setExpenseToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDeleteId) return;

    try {
      await deleteExpense(expenseToDeleteId);
      toast.success('Expense deleted successfully!');
      refetchExpenses(); // Re-fetch expenses after delete
    } catch (err) {
      console.error('Error deleting expense:', err.response?.data || err.message);
      toast.error(`Failed to delete expense: ${err.response?.data?.error || err.message}`);
    } finally {
      setShowDeleteModal(false);
      setExpenseToDeleteId(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setExpenseToDeleteId(null);
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary"><FaHistory className="me-2" />Expense History</h2>
        <SkeletonLoader count={1} type="card" className="mb-4" />
        <SkeletonLoader count={10} type="table-row" />
        <SkeletonLoader type="pagination" />
      </div>
    );
  }

  // Defensive check for expenses being an array before mapping
  if (!Array.isArray(expenses)) {
      console.error("ExpenseHistoryPage: 'expenses' is not an array:", expenses);
      return (
          <div className="container mt-4">
              <h2 className="mb-4 text-center text-primary"><FaHistory className="me-2" />Expense History</h2>
              <ErrorDisplay error={new Error("Data format error")} message="Failed to load expenses due to unexpected data format." />
          </div>
      );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary"><FaHistory className="me-2" />Expense History</h2>
        <ErrorDisplay error={error} message="Failed to load expense history." />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary"><FaHistory className="me-2" />Expense History</h2>

      {/* Filter and Sort Controls */}
      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-light" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="mb-0 text-dark d-flex align-items-center"><FaFilter className="me-2" />Filters & Sorting</h5>
        </div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            {/* Year Filter */}
            <div className="col-md-4">
              <label htmlFor="filterYear" className="form-label">Filter by Year</label>
              <select
                id="filterYear"
                className="form-select"
                value={filterYear}
                onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {/* Month Filter */}
            <div className="col-md-4">
              <label htmlFor="filterMonth" className="form-label">Filter by Month</label>
              <select
                id="filterMonth"
                className="form-select"
                value={filterMonth}
                onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }}
              >
                {months.map((monthName, index) => (
                  <option key={index} value={index === 0 ? '' : index}>
                    {monthName}
                  </option>
                ))}
              </select>
            </div>
            {/* Items Per Page */}
            <div className="col-md-4">
              <label htmlFor="itemsPerPage" className="form-label">Items per page</label>
              <select
                id="itemsPerPage"
                className="form-select"
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            {/* Sort By */}
            <div className="col-md-6">
              <label htmlFor="sortBy" className="form-label">Sort By</label>
              <select
                id="sortBy"
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
            </div>
            {/* Sort Order */}
            <div className="col-md-6">
              <label htmlFor="sortOrder" className="form-label">Sort Order</label>
              <select
                id="sortOrder"
                className="form-select"
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

      {/* Expense List Table */}
      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-info text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="mb-0">All Expenses ({totalCount} found)</h5>
        </div>
        <div className="card-body p-0">
          {expenses.length === 0 ? (
            <p className="text-center text-muted py-4 mb-0">No expenses found matching your criteria.</p>
          ) : (
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
                          onClick={() => handleEditClick(expense)}
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
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav aria-label="Page navigation" className="d-flex justify-content-center mt-4">
          <ul className="pagination shadow-sm rounded-pill">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link rounded-start-pill" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                <FaChevronLeft />
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                  {pageNumber}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link rounded-end-pill" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                <FaChevronRight />
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Edit Expense Modal (reused from DailyExpensesPage) */}
      <ActionModal
        show={showEditModal}
        type="form"
        title="Edit Expense"
        onClose={() => { setShowEditModal(false); setEditingExpense(null); }}
        confirmButtonText={isUpdatingExpense ? 'Updating...' : 'Update'}
        confirmButtonClass="btn-primary"
        cancelButtonClass="btn-secondary"
        isConfirmDisabled={isUpdatingExpense}
        formId="edit-expense-history-form"
      >
        <form id="edit-expense-history-form" onSubmit={handleEditSubmit}>
          <div className="mb-3">
            <label htmlFor="editDescription" className="form-label">Description (Optional)</label>
            <input
              type="text"
              className="form-control"
              id="editDescription"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="editAmount" className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              id="editAmount"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <CategoryDropdown
            id="editCategory"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            categoryType="expense"
            required={true}
            label="Category"
          />
          <div className="mb-3">
            <label htmlFor="editDate" className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              id="editDate"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              required
            />
          </div>
        </form>
      </ActionModal>

      {/* Delete Confirmation Modal (reused from DailyExpenseList) */}
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

export default ExpenseHistoryPage;
