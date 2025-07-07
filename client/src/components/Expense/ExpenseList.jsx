// src/components/Expense/ExpenseList.jsx
import React, { useState, useMemo } from 'react';
import {
  FaCalendarAlt,
  FaChevronDown,
  FaChevronRight,
  FaSort,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa';
// No toast or ActionModal imports as CRUD is removed from this component

import ExpenseListItem from './ExpenseListItem'; // Import the single item component
// import './expense.css'; // Optional: for custom expense-specific styles

/**
 * Helper function to group a flat array of expenses by month and year.
 * This function is used if the backend does not provide pre-grouped data,
 * or if you need to re-group/normalize data on the frontend.
 * It uses 'amount' and 'date' fields from the Expense model.
 */
function groupExpensesByMonthYear(expenses) {
  console.log("groupExpensesByMonthYear: Received expenses for grouping:", expenses);
  const groups = {};
  expenses.forEach((expense) => {
    // Use the 'date' field from the expense object for grouping
    const dateToGroup = new Date(expense.date);
    if (isNaN(dateToGroup.getTime())) {
        console.warn("groupExpensesByMonthYear: Skipping expense due to invalid date:", expense.date, "Full expense:", expense);
        return; // Skip if date is invalid
    }

    const key = `${dateToGroup.getFullYear()}-${String(dateToGroup.getMonth()).padStart(2, '0')}`;
    const label = dateToGroup.toLocaleString('default', { month: 'long', year: 'numeric' });

    if (!groups[key]) {
      groups[key] = { key, label, date: dateToGroup, total: 0, items: [] };
    }

    // Sum the 'amount' field for the group total
    groups[key].total += expense.amount || 0;
    groups[key].items.push(expense);
  });

  // Sort groups by their date in descending order (most recent month first)
  const sortedGroups = Object.values(groups).sort((a, b) => b.date - a.date);
  console.log("groupExpensesByMonthYear: Grouped and sorted data:", sortedGroups);
  return sortedGroups;
}

/**
 * Renders a list of expenses, grouped by month/year, with expand/collapse and sorting within groups.
 * This component does NOT handle CRUD operations directly; it's purely for display.
 */
const ExpenseList = ({ groupedExpenses: initialGroupedExpenses, recentlyAddedId }) => { // Removed onDelete, onUpdate props
  console.log('ExpenseList: Component rendered. Received initialGroupedExpenses prop:', initialGroupedExpenses);

  const [expandedGroups, setExpandedGroups] = useState({}); // State to manage which monthly groups are expanded
  // sortConfig stores the key of the column being sorted and its direction for each group
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Memoize the grouped data. This ensures re-grouping only happens if initialGroupedExpenses changes.
  const groupedData = useMemo(() => {
    // Ensure initialGroupedExpenses is an array; default to empty array if undefined/null
    const dataToProcess = Array.isArray(initialGroupedExpenses) ? initialGroupedExpenses : [];
    console.log("ExpenseList: useMemo - dataToProcess (after array check):", dataToProcess);

    // Check if the data is already grouped by the backend (has 'items' property in first element)
    if (dataToProcess.length > 0 && !dataToProcess[0].items) {
      console.log("ExpenseList: useMemo - Initial data is flat, grouping on frontend.");
      return groupExpensesByMonthYear(dataToProcess); // Group if flat
    }
    console.log("ExpenseList: useMemo - Initial data is already grouped or empty.");
    return dataToProcess; // Use as-is if already grouped or empty
  }, [initialGroupedExpenses]);

  // Handler to toggle the expanded state of a monthly group
  const toggleGroup = (key) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handler to sort columns within a specific monthly group
  const handleSort = (column, groupKey) => {
    const newSortKey = `${groupKey}-${column}`; // Create a unique sort key for the group and column
    setSortConfig((prev) => {
      let direction = 'asc';
      // If the same column in the same group is clicked again, toggle the sort direction
      if (prev.key === newSortKey) {
        direction = prev.direction === 'asc' ? 'desc' : 'asc';
      }
      console.log('ExpenseList: handleSort - newSortConfig:', { key: newSortKey, direction });
      return { key: newSortKey, direction };
    });
  };

  // Memoized function to apply sorting to items within each group
  const sortedGroups = useMemo(() => {
    console.log("ExpenseList: sortedGroups useMemo triggered. groupedData:", groupedData, "sortConfig:", sortConfig);

    // Map over each group to apply sorting to its items
    return groupedData.map((group) => {
      const currentGroupSortKeyPrefix = `${group.key}-`;
      // Check if the current sortConfig applies to this specific group
      const isGroupCurrentlySorted = sortConfig.key?.startsWith(currentGroupSortKeyPrefix);
      // Extract the column name (e.g., 'category', 'amount') from the sort key
      const sortColumn = isGroupCurrentlySorted ? sortConfig.key?.substring(currentGroupSortKeyPrefix.length) : null;
      const sortDirection = sortConfig.direction;

      // Create a mutable copy of the items array for sorting
      const sortedItems = Array.isArray(group.items) ? [...group.items] : [];
      console.log(`ExpenseList: Processing group ${group.key}. Items count: ${sortedItems.length}. Sort column: ${sortColumn}`);

      // Apply sorting if a column is selected for this group
      if (isGroupCurrentlySorted && (sortColumn === 'category' || sortColumn === 'amount' || sortColumn === 'isRecurring' || sortColumn === 'date')) {
        sortedItems.sort((a, b) => {
          let comparison = 0;
          if (sortColumn === 'amount') {
            comparison = (a.amount || 0) - (b.amount || 0); // Sort by 'amount'
          } else if (sortColumn === 'category') {
            comparison = (a.category || '').localeCompare(b.category || ''); // Sort by 'category' string
          } else if (sortColumn === 'isRecurring') {
            // Sort booleans: false before true for ascending, true before false for descending
            comparison = (a.isRecurring === b.isRecurring) ? 0 : (a.isRecurring ? 1 : -1);
          } else if (sortColumn === 'date') {
            comparison = new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime(); // Sort by 'date' timestamp
          }
          return sortDirection === 'asc' ? comparison : -comparison; // Apply ascending or descending
        });
        console.log(`ExpenseList: Group ${group.key} sorted by ${sortColumn}, direction ${sortDirection}. First item:`, sortedItems[0]);
      }
      return { ...group, sortedItems }; // Return the group with its now sorted items
    });
  }, [groupedData, sortConfig]); // Dependencies for memoization: re-run if groupedData or sortConfig changes

  // Display a message if no expense data is found for the selected year
  if (sortedGroups.length === 0) {
    return <p className="text-muted text-center mt-4">No expense data found for the selected year.</p>;
  }

  return (
    <div className="mt-4">
      {sortedGroups.map((group) => {
        const isExpanded = expandedGroups[group.key]; // Check if the current group is expanded
        const currentGroupSortKeyPrefix = `${group.key}-`;
        // Determine the currently sorted column and direction for the current group
        const currentSortColumn = sortConfig.key?.startsWith(currentGroupSortKeyPrefix) ? sortConfig.key.substring(currentGroupSortKeyPrefix.length) : null;
        const currentSortDirection = sortConfig.direction;

        return (
          <div key={group.key} className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            {/* Card header for the monthly group, acts as an expand/collapse toggle */}
            <div
              className="card-header d-flex justify-content-between align-items-center"
              style={{ background: '#f8f9fa', cursor: 'pointer' }}
              onClick={() => toggleGroup(group.key)}
            >
              <div>
                <FaCalendarAlt className="me-2 text-danger" /> {/* Calendar icon for expenses */}
                <strong>{group.label}</strong> {/* Month and Year label */}
              </div>
              <div className="d-flex gap-4 align-items-center">
                {/* Badge displaying total amount for the month */}
                <span className="badge bg-danger text-white">
                  ₹{group.total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
                {/* Chevron icon to indicate expand/collapse state */}
                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              </div>
            </div>

            {/* Render the table of individual expenses only if the group is expanded */}
            {isExpanded && (
              <div className="table-responsive">
                <table className="table table-bordered table-striped align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      {/* Table headers with sort functionality */}
                      <th
                        onClick={() => handleSort('category', group.key)}
                        style={{ cursor: 'pointer' }}
                        className="text-nowrap"
                      >
                        Category{' '}
                        {currentSortColumn === 'category' ? (
                          currentSortDirection === 'asc' ? (
                            <FaSortUp className="ms-1" />
                          ) : (
                            <FaSortDown className="ms-1" />
                          )
                        ) : (
                          <FaSort className="ms-1 text-muted" />
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('amount', group.key)}
                        style={{ cursor: 'pointer' }}
                        className="text-nowrap"
                      >
                        Amount ₹{' '}
                        {currentSortColumn === 'amount' ? (
                          currentSortDirection === 'asc' ? (
                            <FaSortUp className="ms-1" />
                          ) : (
                            <FaSortDown className="ms-1" />
                          )
                        ) : (
                          <FaSort className="ms-1 text-muted" />
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('isRecurring', group.key)} 
                        style={{ cursor: 'pointer' }}
                        className="text-nowrap"
                      >
                        Recurring{' '}
                        {currentSortColumn === 'isRecurring' ? (
                          currentSortDirection === 'asc' ? (
                            <FaSortUp className="ms-1" />
                          ) : (
                            <FaSortDown className="ms-1" />
                          )
                        ) : (
                          <FaSort className="ms-1 text-muted" />
                        )}
                      </th>
                      <th
                        onClick={() => handleSort('date', group.key)} 
                        style={{ cursor: 'pointer' }}
                        className="text-nowrap"
                      >
                        Date{' '}
                        {currentSortColumn === 'date' ? (
                          currentSortDirection === 'asc' ? (
                            <FaSortUp className="ms-1" />
                          ) : (
                            <FaSortDown className="ms-1" />
                          )
                        ) : (
                          <FaSort className="ms-1 text-muted" />
                        )}
                      </th>
                      {/* No Actions column header as per request for no CRUD on list items */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Map through sorted items and render ExpenseListItem for each */}
                    {group.sortedItems.map((expense) => (
                      <ExpenseListItem
                        key={expense._id}
                        expense={expense}
                        recentlyAddedId={recentlyAddedId} // Pass for potential animation
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
