// src/components/Budget/BudgetList.jsx
import React, { useState, useMemo } from 'react';
import { FaCalendarAlt, FaChevronDown, FaChevronRight, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import BudgetListItem from './BudgetListItem';
import SkeletonLoader from '../Common/SkeletonLoader';

/**
 * Renders a list of budget items, grouped by month/year, with expand/collapse and sorting within groups.
 * Includes props for handling CRUD operations via the parent component/hook.
 * @param {object} props - Component props.
 * @param {Array<Object>} props.groupedBudgets - Array of grouped budget data (e.g., [{ key: '2025-06', label: 'June 2025', items: [...] }, ...]).
 * @param {Function} props.onDelete - Callback for delete confirmation.
 * @param {Function} props.onUpdate - Callback for updating a budget item.
 * @param {boolean} props.isLoading - Global loading state from the hook.
 * @param {boolean} props.isDeleting - State indicating if a delete operation is in progress.
 * @param {boolean} props.isUpdating - State indicating if an update operation is in progress.
 */
const BudgetList = ({ groupedBudgets: initialGroupedBudgets, onDelete, onUpdate, isLoading, isDeleting, isUpdating }) => {
  console.log('BudgetList: Component rendered. Received initialGroupedBudgets prop:', initialGroupedBudgets, 'isLoading:', isLoading);

  const [expandedGroups, setExpandedGroups] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Memoize grouped data. Ensure it's always an array.
  const groupedData = useMemo(() => {
    const data = Array.isArray(initialGroupedBudgets) ? initialGroupedBudgets : [];
    console.log("BudgetList: Memoized groupedData:", data);
    return data;
  }, [initialGroupedBudgets]);

  const toggleGroup = (key) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSort = (column, groupKey) => {
    const newSortKey = `${groupKey}-${column}`;
    setSortConfig((prev) => {
      let direction = 'asc';
      if (prev.key === newSortKey) {
        direction = prev.direction === 'asc' ? 'desc' : 'asc';
      }
      return { key: newSortKey, direction };
    });
  };

  const sortedGroups = useMemo(() => {
    return groupedData.map((group) => {
      const groupSortKeyPrefix = `${group.key}-`;
      const isGroupCurrentlySorted = sortConfig.key?.startsWith(groupSortKeyPrefix);
      // Standardize the name to currentGroupSortColumn for consistency
      const currentGroupSortColumn = isGroupCurrentlySorted ? sortConfig.key?.substring(groupSortKeyPrefix.length) : null;
      const sortDirection = sortConfig.direction;

      // Ensure group.items is an array before attempting to sort or spread
      const sortedItems = Array.isArray(group.items) ? [...group.items] : [];

      if (isGroupCurrentlySorted && (currentGroupSortColumn === 'category' || currentGroupSortColumn === 'amount')) {
        sortedItems.sort((a, b) => {
          let comparison = 0;
          if (currentGroupSortColumn === 'amount') { // Using currentGroupSortColumn
            // Ensure amounts are numbers for comparison
            comparison = (Number(a.amount) || 0) - (Number(b.amount) || 0);
          } else if (currentGroupSortColumn === 'category') { // Using currentGroupSortColumn
            comparison = (a.category || '').localeCompare(b.category || '');
          }
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      }
      return { ...group, sortedItems };
    });
  }, [groupedData, sortConfig]);

  if (isLoading) {
    return <SkeletonLoader count={3} type="card" />; // Show skeleton loader during initial load
  }

  if (sortedGroups.length === 0) {
    return <p className="text-muted text-center mt-4">No budgets set for the selected year.</p>;
  }

  return (
    <div className="mt-4">
      {sortedGroups.map((group) => {
        // Basic validation for group structure
        if (!group || !group.key || !group.label || !Array.isArray(group.sortedItems)) {
            console.warn("BudgetList: Skipping malformed group:", group);
            return null; // Skip rendering this malformed group
        }

        const isExpanded = expandedGroups[group.key];
        // Re-derive currentGroupSortColumn for JSX, ensuring consistency
        const groupSortKeyPrefix = `${group.key}-`;
        const isGroupCurrentlySortedInJSX = sortConfig.key?.startsWith(groupSortKeyPrefix);
        const currentGroupSortColumn = isGroupCurrentlySortedInJSX ? sortConfig.key?.substring(groupSortKeyPrefix.length) : null;
        const currentSortDirection = sortConfig.direction;

        console.log(`BudgetList: Group ${group.key}, currentGroupSortColumn: ${currentGroupSortColumn}, currentSortDirection: ${currentSortDirection}`); // Debugging log

        return (
          <div key={group.key} className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div
              className="card-header d-flex justify-content-between align-items-center"
              style={{ background: '#e9f7ef', cursor: 'pointer' }}
              onClick={() => toggleGroup(group.key)}
            >
              <div>
                <FaCalendarAlt className="me-2 text-primary" />
                <strong>{group.label}</strong>
              </div>
              <div className="d-flex gap-4 align-items-center">
                <span className="badge bg-primary text-white">
                  Budgeted: ₹{group.total ? group.total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                </span>
                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              </div>
            </div>

            {isExpanded && (
              <div className="table-responsive">
                <table className="table table-bordered table-striped align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th
                        onClick={() => handleSort('category', group.key)}
                        style={{ cursor: 'pointer' }}
                        className="text-nowrap"
                      >
                        Category{' '}
                        {currentGroupSortColumn === 'category' ? ( // Using currentGroupSortColumn
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
                        {currentGroupSortColumn === 'amount' ? ( // Using currentGroupSortColumn
                          currentSortDirection === 'asc' ? (
                            <FaSortUp className="ms-1" />
                          ) : (
                            <FaSortDown className="ms-1" />
                          )
                        ) : (
                          <FaSort className="ms-1 text-muted" />
                        )}
                      </th>
                      <th>Month</th>
                      <th>Year</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.sortedItems.map((budget) => {
                        // Crucial check: Ensure budget object and its _id are valid
                        if (!budget || !budget._id) {
                            console.warn("BudgetList: Skipping malformed budget item:", budget);
                            return null; // Skip rendering this malformed item
                        }
                        return (
                            <BudgetListItem
                                key={budget._id}
                                budget={budget}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                                isDeleting={isDeleting}
                                isUpdating={isUpdating}
                            />
                        );
                    })}
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

export default BudgetList;
