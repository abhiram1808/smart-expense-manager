// src/components/CommonExpenses/CommonExpenseFilters.jsx
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import CategoryDropdown from '../Shared/CategoryDropdown';
import { FaFilter, FaSort } from 'react-icons/fa';

/**
 * Component for filtering and sorting common expenses.
 * @param {object} props - Component props.
 * @param {Function} props.onFilterChange - Callback when filters change: (filters: { isActive?, category? }) => void
 * @param {Function} props.onSortChange - Callback when sort changes: (sortBy: string) => void
 * @param {Array<Object>} props.commonExpenses - The full list of common expenses to extract unique categories.
 */
const CommonExpenseFilters = ({ onFilterChange, onSortChange, commonExpenses }) => {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'true', 'false'
  const [categoryFilter, setCategoryFilter] = useState(''); // '' for all, or specific category
  const [sortBy, setSortBy] = useState('dayOfMonth'); // Default sort

  // Ref to store the previous filters object for comparison
  const prevFiltersRef = useRef({});

  // Extract unique categories from the commonExpenses list
  // This will re-run if commonExpenses changes, which is fine.
  const uniqueCategories = [
    '', // Option for 'All Categories'
    ...new Set(commonExpenses.map(exp => exp.category))
  ].sort();

  // Effect to trigger filter change when local states update
  useEffect(() => {
    const currentFilters = {};
    if (activeFilter !== 'all') {
      currentFilters.isActive = activeFilter;
    }
    if (categoryFilter) {
      currentFilters.category = categoryFilter;
    }

    // Deep compare the current filters object with the previous one
    // Only call onFilterChange if the filters have actually changed content
    if (JSON.stringify(currentFilters) !== JSON.stringify(prevFiltersRef.current)) {
      if (typeof onFilterChange === 'function') { // Defensive check
        onFilterChange(currentFilters);
      }
      prevFiltersRef.current = currentFilters; // Update the ref with the new filters
    }

  }, [activeFilter, categoryFilter, onFilterChange]); // onFilterChange is stable, activeFilter/categoryFilter are primitives

  // Effect to trigger sort change when local state updates
  useEffect(() => {
    // sortBy is a primitive, so its value changing is enough to trigger
    if (typeof onSortChange === 'function') { // Defensive check
      onSortChange(sortBy);
    }
  }, [sortBy, onSortChange]); // onSortChange is stable, sortBy is a primitive


  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-light d-flex align-items-center" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0 text-dark me-3"><FaFilter className="me-2" />Filter & Sort</h5>
      </div>
      <div className="card-body">
        <div className="row g-3 align-items-end">
          {/* Active Status Filter */}
          <div className="col-md-4">
            <label htmlFor="activeFilter" className="form-label">Active Status</label>
            <select
              className="form-select"
              id="activeFilter"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="col-md-4">
            <label htmlFor="categoryFilter" className="form-label">Category</label>
            <select
              className="form-select"
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {uniqueCategories.map(cat => (
                <option key={cat || 'all'} value={cat}>{cat || 'All Categories'}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="col-md-4">
            <label htmlFor="sortBy" className="form-label">Sort By</label>
            <select
              className="form-select"
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dayOfMonth">Due Day</option>
              <option value="name">Name (A-Z)</option>
              <option value="amount">Amount</option>
              <option value="startDate">Start Date</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonExpenseFilters;
