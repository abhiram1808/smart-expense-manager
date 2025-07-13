// client/src/pages/DailyExpensesPage.jsx
import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaDollarSign, FaChartBar } from 'react-icons/fa';
import AddDailyExpenseForm from '../components/DailyExpense/AddDailyExpenseForm';
import DailyExpenseList from '../components/DailyExpense/DailyExpenseList';
import useExpenses from '../hooks/useExpenseData';
import ActionModal from '../components/common/ActionModal';
import { updateExpense } from '../services/expenseService';
import ErrorDisplay from '../components/common/ErrorDisplay';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { toast } from 'react-toastify';
import CategoryDropdown from '../components/Shared/CategoryDropdown';

/**
 * Page component for adding daily expenses, viewing recent expenses, and seeing a daily summary.
 */
const DailyExpensesPage = () => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Hook to fetch today's expenses for summary calculation
  const { expenses: todayExpenses, isLoading: isLoadingSummary, error: summaryError, refetchExpenses: refetchTodayExpenses } = useExpenses({
    startDate: today,
    endDate: today,
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDate, setEditDate] = useState('');
  const [isUpdatingExpense, setIsUpdatingExpense] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setEditDescription(editingExpense.description || '');
      setEditAmount(editingExpense.amount || '');
      setEditCategory(editingExpense.category || '');
      setEditDate(new Date(editingExpense.date).toISOString().split('T')[0] || '');
      setShowEditModal(true);
    } else {
      setEditDescription('');
      setEditAmount('');
      setEditCategory('');
      setEditDate('');
    }
  }, [editingExpense]);

  const totalTodayExpenses = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
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
      refetchTodayExpenses();
    } catch (err) {
      console.error('Error updating expense:', err.response?.data || err.message);
      toast.error(`Failed to update expense: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsUpdatingExpense(false);
    }
  };

  const handleExpenseChange = () => {
    refetchTodayExpenses(); // Re-fetch summary
    // DailyExpenseList will refetch its own data, but we need to ensure it uses 'today'
  };

  if (isLoadingSummary) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary"><FaMoneyBillWave className="me-2" />Daily Expenses</h2>
        <SkeletonLoader count={1} type="card" className="mb-4" />
        <SkeletonLoader count={5} type="table-row" />
      </div>
    );
  }

  if (summaryError) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary"><FaMoneyBillWave className="me-2" />Daily Expenses</h2>
        <ErrorDisplay
          error={summaryError}
          message="Failed to load data for daily expenses summary."
        />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary"><FaMoneyBillWave className="me-2" />Daily Expenses</h2>

      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="mb-0">Today's Expense Summary ({new Date().toLocaleDateString()})</h5>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 text-success d-flex align-items-center">
              <FaDollarSign className="me-2" /> Total Spent Today:
            </h4>
            <span className="fs-3 fw-bold text-success">
              ₹{totalTodayExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-muted mt-2 mb-0">You have {todayExpenses.length} expenses recorded today.</p>
        </div>
      </div>

      <AddDailyExpenseForm onExpenseAdded={handleExpenseChange} />

      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-info text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="mb-0">Recent Expenses</h5>
        </div>
        <div className="card-body p-0">
          {/* Pass the 'today' date to DailyExpenseList */}
          <DailyExpenseList
            onExpenseDeleted={handleExpenseChange}
            onEditClick={handleEditClick}
            filterDate={today}
            // <--- NEW PROP comment moved here, outside the JSX attribute
          />
        </div>
      </div>

      <ActionModal
        show={showEditModal}
        type="form"
        title="Edit Expense"
        onClose={() => { setShowEditModal(false); setEditingExpense(null); }}
        confirmButtonText={isUpdatingExpense ? 'Updating...' : 'Update'}
        confirmButtonClass="btn-primary"
        cancelButtonClass="btn-secondary"
        isConfirmDisabled={isUpdatingExpense}
        formId="edit-expense-form"
      >
        <form id="edit-expense-form" onSubmit={handleEditSubmit}>
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
    </div>
  );
};

export default DailyExpensesPage;
