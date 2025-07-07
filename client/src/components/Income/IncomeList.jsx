// src/components/Income/IncomeList.jsx
import React, { useState, useMemo } from 'react';
import {
  FaCalendarAlt,
  FaChevronDown,
  FaChevronRight,
  FaSort,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa';
import IncomeListItem from './IncomeListItem';

/**
 * Helper function to group a flat array of incomes by month and year.
 * This function is used if the backend does not provide pre-grouped data,
 * or if you need to re-group/normalize data on the frontend.
 * It uses 'amount' and 'date' fields from the Income model.
 */
function groupIncomesByMonthYear(incomes) {
  console.log("groupIncomesByMonthYear: Received incomes for grouping:", incomes);
  const groups = {};
  incomes.forEach((income) => {
    // Use the 'date' field from the income object for grouping
    const dateToGroup = new Date(income.date);
    if (isNaN(dateToGroup.getTime())) {
        console.warn("groupIncomesByMonthYear: Skipping income due to invalid date:", income.date, "Full income:", income);
        return; // Skip if date is invalid
    }

    const key = `${dateToGroup.getFullYear()}-${String(dateToGroup.getMonth()).padStart(2, '0')}`;
    const label = dateToGroup.toLocaleString('default', { month: 'long', year: 'numeric' });

    if (!groups[key]) {
      groups[key] = { key, label, date: dateToGroup, total: 0, items: [] };
    }

    // Sum the 'amount' field for the group total
    groups[key].total += income.amount || 0;
    groups[key].items.push(income);
  });

  // Sort groups by their date in descending order (most recent month first)
  const sortedGroups = Object.values(groups).sort((a, b) => b.date - a.date);
  console.log("groupIncomesByMonthYear: Grouped and sorted data:", sortedGroups);
  return sortedGroups;
}

/**
 * Renders a list of incomes, grouped by month/year, with expand/collapse and sorting within groups.
 * Includes props for handling CRUD operations via the parent component/hook.
 */
const IncomeList = ({ groupedIncomes: initialGroupedIncomes, onDelete, onUpdate, recentlyAddedId }) => {
  console.log('IncomeList: Component rendered. Received initialGroupedIncomes prop:', initialGroupedIncomes);

  const [expandedGroups, setExpandedGroups] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Memoize the grouped data.
  const groupedData = useMemo(() => {
    const dataToProcess = Array.isArray(initialGroupedIncomes) ? initialGroupedIncomes : [];
    console.log("IncomeList: useMemo - dataToProcess (after array check):", dataToProcess);

    // Check if the data is already grouped by the backend (has 'items' property in first element)
    if (dataToProcess.length > 0 && !dataToProcess[0].items) {
      console.log("IncomeList: useMemo - Initial data is flat, grouping on frontend.");
      return groupIncomesByMonthYear(dataToProcess); // Group if flat
    }
    console.log("IncomeList: useMemo - Initial data is already grouped or empty.");
    return dataToProcess; // Use as-is if already grouped or empty
  }, [initialGroupedIncomes]);

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
      console.log('IncomeList: handleSort - newSortConfig:', { key: newSortKey, direction });
      return { key: newSortKey, direction };
    });
  };

  const sortedGroups = useMemo(() => {
    console.log("IncomeList: sortedGroups useMemo triggered. groupedData:", groupedData, "sortConfig:", sortConfig);
    return groupedData.map((group) => {
      const currentGroupSortKeyPrefix = `${group.key}-`;
      const isGroupCurrentlySorted = sortConfig.key?.startsWith(currentGroupSortKeyPrefix);
      const sortColumn = isGroupCurrentlySorted ? sortConfig.key?.substring(currentGroupSortKeyPrefix.length) : null;
      const sortDirection = sortConfig.direction;

      const sortedItems = Array.isArray(group.items) ? [...group.items] : [];
      console.log(`IncomeList: Processing group ${group.key}. Items count: ${sortedItems.length}. Sort column: ${sortColumn}`);

      if (isGroupCurrentlySorted && (sortColumn === 'source' || sortColumn === 'amount' || sortColumn === 'date')) {
        sortedItems.sort((a, b) => {
          let comparison = 0;
          if (sortColumn === 'amount') {
            comparison = (a.amount || 0) - (b.amount || 0);
          } else if (sortColumn === 'source') {
            comparison = (a.source || '').localeCompare(b.source || '');
          } else if (sortColumn === 'date') {
            comparison = new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
          }
          return sortDirection === 'asc' ? comparison : -comparison;
        });
        console.log(`IncomeList: Group ${group.key} sorted by ${sortColumn}, direction ${sortDirection}. First item:`, sortedItems[0]);
      }
      return { ...group, sortedItems };
    });
  }, [groupedData, sortConfig]);

  console.log('IncomeList: Final sortedGroups count:', sortedGroups.length);

  if (sortedGroups.length === 0) {
    return <p className="text-muted text-center mt-4">No income data found for the selected year.</p>;
  }

  return (
    <div className="mt-4">
      {sortedGroups.map((group) => {
        const isExpanded = expandedGroups[group.key];
        const currentGroupSortKeyPrefix = `${group.key}-`;
        const currentSortColumn = sortConfig.key?.startsWith(currentGroupSortKeyPrefix) ? sortConfig.key.substring(currentGroupSortKeyPrefix.length) : null;
        const currentSortDirection = sortConfig.direction;

        return (
          <div key={group.key} className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <div
              className="card-header d-flex justify-content-between align-items-center"
              style={{ background: '#e9f7ef', cursor: 'pointer' }}
              onClick={() => toggleGroup(group.key)}
            >
              <div>
                <FaCalendarAlt className="me-2 text-success" />
                <strong>{group.label}</strong>
              </div>
              <div className="d-flex gap-4 align-items-center">
                <span className="badge bg-success text-white">
                  ₹{group.total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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
                        onClick={() => handleSort('source', group.key)}
                        style={{ cursor: 'pointer' }}
                        className="text-nowrap"
                      >
                        Source{' '}
                        {currentSortColumn === 'source' ? (
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
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.sortedItems.map((income) => (
                      <IncomeListItem
                        key={income._id}
                        income={income}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                        recentlyAddedId={recentlyAddedId}
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

export default IncomeList;
