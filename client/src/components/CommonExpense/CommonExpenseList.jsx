// src/components/CommonExpenses/CommonExpenseList.jsx
import React from 'react';
import CommonExpenseCard from './CommonExpenseCard'; // Import the new card component
import SkeletonLoader from '../common/SkeletonLoader';

/**
 * Renders a grid of common expense cards.
 * @param {object} props - Component props.
 * @param {Array<Object>} props.commonExpenses - Array of common expense objects to display.
 * @param {Function} props.onDelete - Callback for initiating a delete action.
 * @param {Function} props.onUpdate - Callback for updating a common expense.
 * @param {boolean} props.isLoading - Global loading state from the hook.
 * @param {boolean} props.isDeleting - State indicating if a delete operation is in progress.
 * @param {boolean} props.isUpdating - State indicating if an update operation is in progress.
 */
const CommonExpenseList = ({ commonExpenses, onDelete, onUpdate, isLoading, isDeleting, isUpdating }) => {
  if (isLoading) {
    // Show a grid of card skeletons during initial load
    return (
      <div className="row">
        {[...Array(3)].map((_, index) => ( // Show 3 card skeletons
          <div className="col-md-6 col-lg-4 mb-4" key={index}>
            <SkeletonLoader type="card" />
          </div>
        ))}
      </div>
    );
  }

  if (!commonExpenses || commonExpenses.length === 0) {
    return <p className="text-muted text-center mt-4">No recurring expenses defined yet. Add one above!</p>;
  }

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Your Recurring Expenses</h5>
      </div>
      <div className="card-body"> {/* Added padding back for the cards */}
        <div className="row"> {/* Use Bootstrap grid for cards */}
          {commonExpenses.map((expense) => (
            <CommonExpenseCard
              key={expense._id}
              commonExpense={expense}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isDeleting={isDeleting}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommonExpenseList;
