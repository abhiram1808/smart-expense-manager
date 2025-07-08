// src/pages/CommonExpenseAnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import useCommonExpenses from '../hooks/useCommonExpenseData';
import CommonExpenseSummary from '../components/CommonExpense/CommonExpenseSummary';
import CommonExpenseFilters from '../components/CommonExpense/CommonExpenseFilters';
import CommonExpenseCharts from '../components/CommonExpense/CommonExpenseCharts';
import CommonExpenseList from '../components/CommonExpense/CommonExpenseList'; // Import the list component to show filtered data
import ErrorDisplay from '../components/common/ErrorDisplay';
import SkeletonLoader from '../components/common/SkeletonLoader';

/**
 * Common Expense Analytics Page.
 * Displays summary, allows filtering/sorting for analytical view, and shows charts.
 */
const CommonExpenseAnalyticsPage = () => {
  const {
    commonExpenses, // This array is now filtered and sorted by the hook based on `setFilters`/`setSortBy`
    isLoading,
    error,
    fetchCommonExpenseAnalytics,
    setFilters,
    setSortBy,
  } = useCommonExpenses();

  const [analyticsData, setAnalyticsData] = useState({
    summaryByCategory: [],
    summaryByDay: [],
    totalActive: 0,
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      try {
        const data = await fetchCommonExpenseAnalytics();
        setAnalyticsData(data);
      } catch (err) {
        setAnalyticsError(err);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    loadAnalytics();
  }, [fetchCommonExpenseAnalytics]);

  // Combined loading state
  const overallLoading = isLoading || analyticsLoading;

  if (overallLoading) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-info">📊 Recurring Expense Analytics</h2>
        <CommonExpenseSummary commonExpenses={[]} isLoading={true} />
        <SkeletonLoader count={1} type="card" className="mb-4" /> {/* Skeleton for Filters */}
        <CommonExpenseCharts isLoading={true} /> {/* Skeleton for Charts */}
        <SkeletonLoader count={1} type="card" className="mb-4" /> {/* Skeleton for filtered list */}
      </div>
    );
  }

  if (error || analyticsError) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-info">📊 Recurring Expense Analytics</h2>
        <ErrorDisplay
          error={error || analyticsError}
          message="Failed to load recurring expense analytics."
        />
        <p className="text-center mt-3">Please ensure your backend server is running and accessible.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-info">📊 Recurring Expense Analytics</h2>

      {/* Summary Section */}
      <CommonExpenseSummary commonExpenses={commonExpenses} isLoading={isLoading} />

      {/* Filters for the analytical view */}
      <CommonExpenseFilters
        onFilterChange={setFilters}
        onSortChange={setSortBy}
        commonExpenses={commonExpenses} // Pass full list to extract categories for filter dropdown
      />

      {/* Charts Section */}
      <CommonExpenseCharts
        summaryByCategory={analyticsData.summaryByCategory}
        summaryByDay={analyticsData.summaryByDay}
        isLoading={overallLoading}
      />

      {/* Display the filtered and sorted list of common expenses */}
      <div className="card shadow-lg mb-4" style={{ borderRadius: '15px' }}> {/* Enhanced card styling */}
        <div className="card-header bg-gradient-primary text-white border-bottom-0" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h5 className="mb-0 text-center">Detailed Recurring Expenses (Filtered View)</h5>
        </div>
        <div className="card-body p-0">
          {/* Reusing CommonExpenseList but disabling actions */}
          <CommonExpenseList
            commonExpenses={commonExpenses} // This is the filtered and sorted list from the hook
            onDelete={() => toast.info("Delete action not available on analytics page.")}
            onUpdate={() => toast.info("Edit action not available on analytics page.")}
            isLoading={isLoading}
            isDeleting={false} // Always false for analytics page
            isUpdating={false} // Always false for analytics page
          />
        </div>
      </div>
    </div>
  );
};

export default CommonExpenseAnalyticsPage;
