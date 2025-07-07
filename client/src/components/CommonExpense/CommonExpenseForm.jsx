import React, { useState } from 'react';
import CategoryDropdown from '../Shared/CategoryDropdown';

const CommonExpenseForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    category: '',
    amount: '',
    startDate: '',
    duration: '',
    isActive: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.startDate) return;
    onAdd({
      ...form,
      amount: parseFloat(form.amount),
      duration: form.duration ? parseInt(form.duration) : undefined,
    }); // Triggers confirmation modal in parent
    setForm({ category: '', amount: '', startDate: '', duration: '', isActive: true });
  };

  return (
    <form onSubmit={handleSubmit} className="row g-2 align-items-center mb-3">
      <div className="col-md-3">
        <CategoryDropdown
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </div>
      <div className="col-md-2">
        <input
          type="number"
          placeholder="Amount"
          className="form-control"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
      </div>
      <div className="col-md-3">
        <input
          type="date"
          className="form-control"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
      </div>
      <div className="col-md-2">
        <input
          type="number"
          placeholder="Duration (months)"
          className="form-control"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />
      </div>
      <div className="col-md-1 d-flex align-items-center">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
        />
        <span className="ms-1">Active</span>
      </div>
      <div className="col-md-1">
        <button type="submit" className="btn btn-success w-100">Add</button>
      </div>
    </form>
  );
};

export default CommonExpenseForm;
