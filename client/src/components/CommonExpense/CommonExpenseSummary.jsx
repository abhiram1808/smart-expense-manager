// client/src/components/CommonExpense/CommonExpenseSummary.jsx
import React, { useEffect, useState } from 'react';
import {
  fetchCommonExpenseSummaryByCategory, // <--- VERIFY THIS IMPORT
  fetchCommonExpenseSummaryByDayOfMonth, // <--- VERIFY THIS IMPORT
  fetchTotalActiveCommonExpensesAmount, // <--- VERIFY THIS IMPORT
} from '../../services/commonExpenseService';
import ErrorDisplay from '../common/ErrorDisplay';
import SkeletonLoader from '../common/SkeletonLoader';
import { FaChartPie, FaCalendarDay, FaDollarSign } from 'react-icons/fa';

/**
 * Displays summary information for recurring expense templates.
 * Includes total active amount, summary by category, and summary by day of month.
 */
const CommonExpenseSummary = () => {
  const [summaryData, setSummaryData] = useState({
    totalActiveAmount: 0,
    categorySummary: [],
    dayOfMonthSummary: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSummaries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          totalActiveRes,
          categoryRes,
          dayOfMonthRes,
        ] = await Promise.all([
          fetchTotalActiveCommonExpensesAmount(),
          fetchCommonExpenseSummaryByCategory(),
          fetchCommonExpenseSummaryByDayOfMonth(),
        ]);

        setSummaryData({
          totalActiveAmount: totalActiveRes.data.totalAmount || 0,
          categorySummary: categoryRes.data || [],
          dayOfMonthSummary: dayOfMonthRes.data || [],
        });
      } catch (err) {
        console.error('Error fetching common expense summaries:', err.response?.data || err.message);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getSummaries();
  }, []);

  if (isLoading) {
    return (
      <div className="row">
        <div className="col-md-4 mb-4"><SkeletonLoader type="card" /></div>
        <div className="col-md-4 mb-4"><SkeletonLoader type="card" /></div>
        <div className="col-md-4 mb-4"><SkeletonLoader type="card" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        message="Failed to load recurring expense summaries."
      />
    );
  }

  return (
    <div className="row">
      {/* Total Active Amount */}
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body d-flex flex-column justify-content-between">
            <h5 className="card-title text-primary d-flex align-items-center mb-3">
              <FaDollarSign className="me-2" /> Total Active Recurring Amount
            </h5>
            <p className="card-text fs-3 fw-bold text-center">
              ₹{summaryData.totalActiveAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-muted text-center mb-0">Sum of all active recurring expense templates per month.</p>
          </div>
        </div>
      </div>

      {/* Summary by Category */}
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-primary d-flex align-items-center mb-3">
              <FaChartPie className="me-2" /> Recurring by Category
            </h5>
            {summaryData.categorySummary.length > 0 ? (
              <ul className="list-group list-group-flush flex-grow-1">
                {summaryData.categorySummary.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{item._id}</span>
                    <span className="badge bg-secondary rounded-pill">
                      ₹{item.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-center mt-3">No recurring expenses by category.</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary by Day of Month */}
      <div className="col-md-4 mb-4">
        <div className="card shadow-sm h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-primary d-flex align-items-center mb-3">
              <FaCalendarDay className="me-2" /> Recurring by Day of Month
            </h5>
            {summaryData.dayOfMonthSummary.length > 0 ? (
              <ul className="list-group list-group-flush flex-grow-1">
                {summaryData.dayOfMonthSummary.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>Day {item._id}</span>
                    <span className="badge bg-secondary rounded-pill">
                      ₹{item.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-center mt-3">No recurring expenses by day of month.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonExpenseSummary;
