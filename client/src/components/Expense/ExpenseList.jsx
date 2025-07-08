// src/components/Expenses/ExpenseList.jsx
import React from 'react';
import ExpenseListItem from './ExpenseListItem';
import SkeletonLoader from '../common/SkeletonLoader';

/**
 * Renders a table list of expense items.
 * @param {object} props - Component props.
 * @param {Array<Object>} props.expenses - Array of expense objects to display.
 * @param {Function} props.onDelete - Callback for initiating a delete action.
 * @param {Function} props.onUpdate - Callback for updating an expense.
 * @param {boolean} props.isLoading - Global loading state from the hook.
 * @param {boolean} props.isDeleting - State indicating if a delete operation is in progress.
 * @param {boolean} props.isUpdating - State indicating if an update operation is in progress.
 */
const ExpenseList = ({ expenses, onDelete, onUpdate, isLoading, isDeleting, isUpdating }) => {
  // --- CRITICAL DEBUGGING POINT ---
  console.log('ExpenseList: Component rendered. Received expenses prop:', expenses);
  if (Array.isArray(expenses)) {
    console.log('ExpenseList: Received expenses array length:', expenses.length);
  } else {
    console.log('ExpenseList: Received expenses prop is NOT an array. Type:', typeof expenses);
  }
  // --------------------------------

  if (isLoading) {
    console.log('ExpenseList: Displaying SkeletonLoader because isLoading is true.');
    return <SkeletonLoader count={5} type="table-row" />;
  }

  if (!expenses || expenses.length === 0) {
    console.log('ExpenseList: No expenses to display or expenses array is empty.');
    return <p className="text-muted text-center mt-4">No expenses recorded yet. Add one above or check your filters!</p>;
  }

  console.log('ExpenseList: Rendering expenses table with', expenses.length, 'items.');
  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-primary text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Your Expenses</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Category</th>
                <th>Amount (₹)</th>
                <th>Date</th>
                <th>Description</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Ensure key is unique and stable, _id is perfect */}
              {expenses.map((expense) => (
                <ExpenseListItem
                  key={expense._id} // Make sure _id is present and unique for each expense
                  expense={expense}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  isDeleting={isDeleting}
                  isUpdating={isUpdating}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
