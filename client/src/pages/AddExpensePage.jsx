// pages/AddExpensePage.jsx
import React from 'react';
import AddExpenseForm from '../components/Expense/AddExpenseForm';

const AddExpensePage = () => (
  <div className="container mt-4">
    <h2 className="mb-3">Add New Expense</h2>
    <AddExpenseForm />
  </div>
);

export default AddExpensePage;
