// client/src/components/CommonExpense/CommonExpenseList.jsx
import React from 'react';
import CommonExpenseListItem from './CommonExpenseListItem.jsx';
import SkeletonLoader from '../common/SkeletonLoader';

/**
 * Displays a list of common expense items, now acting as recurring expense templates.
 * @param {object} props - Component props.
 * @param {Array<object>} props.commonExpenses - Array of common expense templates.
 * @param {Function} props.onUpdate - Callback for updating an item.
 * @param {Function} props.onDelete - Callback for deleting an item.
 * @param {boolean} props.isLoading - Loading state from parent.
 * @param {boolean} props.isUpdating - Updating state from parent.
 * @param {boolean} props.isDeleting - Deleting state from parent.
 * @param {Array<string>} props.uniqueCategories - List of existing categories for dropdown.
 * @param {Function} props.onEditClick - Callback to open the edit modal in the parent.
 * @param {Function} props.onToggleActive - Callback to toggle active status.
 */
const CommonExpenseList = ({
  commonExpenses,
  onUpdate,
  onDelete,
  isLoading,
  isUpdating,
  isDeleting,
  uniqueCategories,
  onEditClick,
  onToggleActive,
}) => {
  if (isLoading) {
    return <SkeletonLoader count={5} type="table-row" />;
  }

  if (commonExpenses.length === 0) {
    return null;
  }

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-light" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0 text-dark">Your Recurring Expense Templates</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Day</th>
                <th>Starts</th>
                <th>Term (Months)</th>
                <th>Ends</th>
                <th>Recurring</th> {/* <--- NEW COLUMN HEADER */}
                <th>Last Updated</th> {/* <--- CHANGED COLUMN HEADER */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commonExpenses.map((item) => (
                <CommonExpenseListItem
                  key={item._id}
                  item={item}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                  uniqueCategories={uniqueCategories}
                  onEditClick={onEditClick}
                  onToggleActive={onToggleActive}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommonExpenseList;
