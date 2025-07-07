import React from 'react';
import CommonExpenseListItem from './CommonExpenseListItem';

const CommonExpenseList = ({ expenses, onDelete, onUpdate, onToggle }) => (
  <table className="table table-striped table-bordered">
    <thead className="table-dark">
      <tr>
        <th>Category</th>
        <th>Amount (₹)</th>
        <th>Start Date</th>
        <th>Duration (mo)</th>
        <th>Active</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {expenses.map((exp) => (
        <CommonExpenseListItem
          key={exp._id}
          expense={exp}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onToggle={onToggle}
        />
      ))}
    </tbody>
  </table>
);

export default CommonExpenseList;
