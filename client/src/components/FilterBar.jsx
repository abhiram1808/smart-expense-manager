import React, { useState } from 'react';

const categories = ['All', 'Food', 'Travel', 'Bills', 'Shopping', 'Other'];
const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const FilterBar = ({ setFilters, onAdd }) => {
  const [form, setForm] = useState({ title: '', amount: '', category: '' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ title: '', amount: '', category: '' });
  };

  const applyFilters = () => {
    setFilters({ category: selectedCategory, month: selectedMonth });
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit} className="row g-2 mb-3">
        <div className="col">
          <input className="form-control" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="col">
          <input className="form-control" type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
        </div>
        <div className="col">
          <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
            <option value="">Select Category</option>
            {categories.slice(1).map(cat => <option key={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="col">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      {/* Filters */}
      <div className="row g-2">
        <div className="col-md-3">
          <select className="form-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {months.map(month => <option key={month}>{month}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-outline-secondary w-100" onClick={applyFilters}>Apply Filter</button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
