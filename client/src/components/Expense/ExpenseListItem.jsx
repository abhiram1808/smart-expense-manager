// src/components/Expense/ExpenseListItem.jsx
import React from 'react';
// No FaEdit, FaTrash, FaCheck, FaTimes as CRUD operations are removed from list items
// No toast import as it's not used here

/**
 * Represents a single expense item row in the list,
 * displaying its details without inline editing or delete buttons.
 */
const ExpenseListItem = ({ expense, recentlyAddedId }) => { // Removed onDelete, onUpdate props
  console.log('ExpenseListItem: Rendering expense:', expense);

  // Defensive checks for amount and date for display, using 'amount' and 'date' from schema
  const displayAmount = typeof expense.amount === 'number' && !isNaN(expense.amount)
    ? expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00'; // Default to 0.00 if amount is invalid or missing

  let displayDate = 'N/A';
  if (expense.date) {
    const dateObj = new Date(expense.date);
    if (!isNaN(dateObj.getTime())) { // Check if dateObj is a valid date
      displayDate = dateObj.toLocaleDateString(); // Format date for display
    } else {
      console.warn('ExpenseListItem: Invalid date format for expense.date:', expense.date, 'Full expense:', expense);
    }
  } else {
    console.warn('ExpenseListItem: date is missing for expense:', expense);
  }

  return (
    // Add a class for recently added items for visual feedback (e.g., flash animation)
    // Assumes you have 'animate__animated animate__flash' classes from a CSS library like Animate.css
    <tr className={recentlyAddedId === expense._id ? 'table-warning animate__animated animate__flash' : ''}>
      <td>{expense.category || 'N/A'}</td> {/* Display category, with fallback */}
      <td>₹{displayAmount}</td> {/* Display formatted amount */}
      <td>
        {/* Display recurring status as Yes/No badge */}
        <span className={`badge ${expense.isRecurring ? 'bg-success' : 'bg-secondary'}`}>
          {typeof expense.isRecurring === 'boolean' ? (expense.isRecurring ? 'Yes' : 'No') : 'N/A'}
        </span>
      </td>
      <td>{displayDate}</td> {/* Display formatted date */}
      {/* No Actions column as per request */}
    </tr>
  );
};

export default ExpenseListItem;
