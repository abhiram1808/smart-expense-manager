import React from 'react';

const ExpenseFilters = ({ filters, onChange }) => {
  return (
    <div className="row g-3 mb-3">
      <div className="col-md-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search title..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>
      <div className="col-md-3">
        <select
          className="form-select"
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="Rent">Rent</option>
          <option value="Groceries">Groceries</option>
          <option value="Travel">Travel</option>
          <option value="Utilities">Utilities</option>
        </select>
      </div>
      <div className="col-md-3">
        <select
          className="form-select"
          value={filters.recurring}
          onChange={(e) => onChange({ ...filters, recurring: e.target.value })}
        >
          <option value="">All</option>
          <option value="true">Recurring</option>
          <option value="false">Non-Recurring</option>
        </select>
      </div>
      <div className="col-md-3">
        <input
          type="month"
          className="form-control"
          value={filters.month}
          onChange={(e) => onChange({ ...filters, month: e.target.value })}
        />
      </div>
    </div>
  );
};

export default ExpenseFilters;
