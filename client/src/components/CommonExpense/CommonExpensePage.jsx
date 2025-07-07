import React, { useState } from 'react';
import useCommonExpenseData from '../../hooks/useCommonExpenseData';
import CommonExpenseForm from './CommonExpenseForm';
import CommonExpenseList from './CommonExpenseList';
import ActionModal from '../Common/ActionModal';

const CommonExpensePage = () => {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    toggleExpense,
    loading,
  } = useCommonExpenseData();

  // Modal state
  const [modal, setModal] = useState({ show: false, type: '', data: null });

  // Handlers for CRUD with confirmation
  const handleAdd = (expense) => {
    setModal({ show: true, type: 'add', data: expense });
  };
  const handleUpdate = (expense) => {
    setModal({ show: true, type: 'update', data: expense });
  };
  const handleDelete = (id) => {
    setModal({ show: true, type: 'delete', data: id });
  };
  const handleModalConfirm = () => {
    if (modal.type === 'add') addExpense(modal.data);
    if (modal.type === 'update') updateExpense(modal.data);
    if (modal.type === 'delete') deleteExpense(modal.data);
    setModal({ show: false, type: '', data: null });
  };
  const handleModalClose = () => setModal({ show: false, type: '', data: null });

  return (
    <div className="container mt-4">
      <h3>📌 Common Recurring Expenses</h3>
      <CommonExpenseForm onAdd={handleAdd} />
      <hr />
      <h5 className="mt-4">📋 Saved Common Expenses</h5>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CommonExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onToggle={toggleExpense}
        />
      )}
      <ActionModal
        show={modal.show}
        type={modal.type}
        title={
          modal.type === 'add'
            ? 'Confirm Add Common Expense?'
            : modal.type === 'update'
            ? 'Confirm Update Common Expense?'
            : modal.type === 'delete'
            ? 'Confirm Delete Common Expense?'
            : ''
        }
        onConfirm={handleModalConfirm}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default CommonExpensePage;
