// src/pages/ExpenseAnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import useExpenses from '../hooks/useExpenseData'; // Use the expenses hook for analytics data
import ExpenseCharts from '../components/Expense/ExpenseCharts'; // Import the charts container
import ErrorDisplay from '../components/common/ErrorDisplay';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { FaChartLine } from 'react-icons/fa'; // Icon for the page title

/**
 * Expense Analytics Page.
 * Displays various charts and summaries related to user expenses.
 */
const ExpenseAnalyticsPage = () => {
  const {
    getExpenseAnalytics, // Function to fetch analytics data
    error, // Error from the hook (e.g., if initial fetch fails)
  } = useExpenses(); // We only need the analytics function from this hook

  const [analyticsData, setAnalyticsData] = useState({
    byCategory: [],
    monthlySummary: [],
    yearlySummary: [],
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // For monthly summary year filter

  // Fetch analytics data on component mount or when selectedYear changes
  useEffect(() => {
    const loadAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      try {
        // Pass the selected year for the monthly summary
        const data = await getExpenseAnalytics({ year: selectedYear });
        setAnalyticsData(data);
      } catch (err) {
        setAnalyticsError(err);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    loadAnalytics();
  }, [getExpenseAnalytics, selectedYear]); // Re-fetch when selectedYear changes

  const overallError = error || analyticsError;

  // Dynamically generate years for the dropdown (e.g., last 5 years + next 1 year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i).sort((a, b) => b - a); // 5 years back, current year

  if (analyticsLoading) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-success"><FaChartLine className="me-2" />Expense Analytics</h2>
        <SkeletonLoader count={1} type="card" className="mb-4" /> {/* Placeholder for year filter */}
        <ExpenseCharts isLoading={true} /> {/* Skeletons for charts */}
      </div>
    );
  }

  if (overallError) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-success"><FaChartLine className="me-2" />Expense Analytics</h2>
        <ErrorDisplay
          error={overallError}
          message="Failed to load expense analytics."
        />
        <p className="text-center mt-3">Please ensure your backend server is running and accessible and has data.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-success"><FaChartLine className="me-2" />Expense Analytics</h2>

      {/* Year Filter for Monthly Summary */}
      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <label htmlFor="selectYear" className="form-label mb-0">Select Year for Monthly View:</label>
            </div>
            <div className="col-md-4">
              <select
                id="selectYear"
                className="form-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Charts */}
      <ExpenseCharts
        summaryByCategory={analyticsData.byCategory}
        monthlySummary={analyticsData.monthlySummary}
        yearlySummary={analyticsData.yearlySummary}
        isLoading={analyticsLoading}
      />
    </div>
  );
};

export default ExpenseAnalyticsPage;
