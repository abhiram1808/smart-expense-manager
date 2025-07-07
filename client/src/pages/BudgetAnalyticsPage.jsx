// src/pages/BudgetAnalyticsPage.jsx
import React, { useState, useMemo } from 'react';
// Import budget-specific hooks
import useBudgetByCatData from '../hooks/useBudgetByCatData';
import useMonthlyBudgetTrendData from '../hooks/useMonthlyBudgetTrendData';
import useBudgetVsActualData from '../hooks/useBudgetVsActualData';

// Import budget-specific chart components
import BudgetByCategoryPieChart from '../components/Analytics/BudgetByCategoryPieChart';
import BudgetTrendLineChart from '../components/Analytics/BudgetTrendLineChart';
import BudgetVsActualBarChart from '../components/Analytics/BudgetVsActualBarChart';

import SkeletonLoader from '../components/Common/SkeletonLoader';
import ErrorDisplay from '../components/Common/ErrorDisplay'; // Assuming you have this for consistent error display

/**
 * Dedicated page component for displaying budget-specific analytics.
 * Includes yearly budget total, category breakdown, monthly trends, and budget vs actual comparison.
 */
const BudgetAnalyticsPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // State for the year filter

  // Fetch data for Budget Breakdown by Category (Pie Chart)
  const { data: budgetByCatData, isLoading: budgetCatLoading, error: budgetCatError } = useBudgetByCatData(selectedYear);

  // Fetch data for Monthly Budget Trend (Line Chart)
  const { data: monthlyBudgetTrendData, isLoading: monthlyBudgetTrendLoading, error: monthlyBudgetTrendError } = useMonthlyBudgetTrendData(selectedYear);

  // Fetch data for Budget vs Actual (Bar Chart)
  const { data: budgetVsActualData, isLoading: budgetVsActualLoading, error: budgetVsActualError } = useBudgetVsActualData(selectedYear);

  // Determine overall loading and error states for this page
  const loading = budgetCatLoading || monthlyBudgetTrendLoading || budgetVsActualLoading;
  const error = budgetCatError || monthlyBudgetTrendError || budgetVsActualError;

  // Calculate Yearly Budget Total from monthlyBudgetTrendData
  const yearlyBudgetTotal = useMemo(() => {
    if (!monthlyBudgetTrendData || monthlyBudgetTrendData.length === 0) {
      return 0;
    }
    return monthlyBudgetTrendData.reduce((sum, monthData) => sum + (monthData.budget || 0), 0);
  }, [monthlyBudgetTrendData]);

  if (loading) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary">📊 Budget Analytics</h2>
        <div className="d-flex justify-content-end align-items-center mb-4">
          <SkeletonLoader count={1} type="text-line" className="w-25" />
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <SkeletonLoader count={1} type="card" /> {/* Skeleton for Yearly Budget Total Card */}
          </div>
          <div className="col-md-8 mb-4">
            <SkeletonLoader count={1} type="card" /> {/* Placeholder for a larger chart skeleton */}
          </div>
          <div className="col-md-6 mb-4">
            <SkeletonLoader count={1} type="card" /> {/* Skeleton for Budget Pie Chart */}
          </div>
          <div className="col-md-6 mb-4">
            <SkeletonLoader count={1} type="card" /> {/* Skeleton for Budget Line Chart */}
          </div>
          <div className="col-12 mb-4">
            <SkeletonLoader count={1} type="card" /> {/* Skeleton for Budget vs Actual Chart */}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary">📊 Budget Analytics</h2>
        <ErrorDisplay
          error={error}
          message="Failed to load budget analytics data."
        />
        <p className="text-center mt-3">Please ensure your backend server is running and accessible, and that budget data exists for the selected year.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary">📊 Budget Analytics</h2>

      {/* Year Selector - applies to all charts on this page */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        <label htmlFor="budgetAnalyticsYear" className="form-label mb-0 me-2">Select Year:</label>
        <input
          type="number"
          id="budgetAnalyticsYear"
          className="form-control form-control-sm w-auto"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          min="2000"
          max={new Date().getFullYear() + 5}
        />
      </div>

      <div className="row">
        {/* Yearly Budget Total Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100" style={{ borderRadius: '12px', backgroundColor: '#e9eff7' }}>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h4 className="card-title text-primary mb-3">Total Budget {selectedYear}</h4>
              <p className="display-5 text-primary mb-0">
                ₹{yearlyBudgetTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder for a larger budget-related overview chart if needed */}
        {/* For now, let's keep it simple or remove this col-md-8 if not used */}
        <div className="col-md-8 mb-4">
            <div className="card shadow-sm h-100" style={{ borderRadius: '12px', backgroundColor: '#f8f9fa' }}>
                <div className="card-body d-flex flex-column justify-content-center align-items-center text-muted">
                    <p className="mb-0">Additional budget overview chart can go here.</p>
                </div>
            </div>
        </div>
      </div>

      <div className="row">
        {/* Budget Breakdown by Category Pie Chart */}
        <div className="col-md-6 mb-4">
          <BudgetByCategoryPieChart data={budgetByCatData} />
        </div>

        {/* Monthly Budget Trend Line Chart */}
        <div className="col-md-6 mb-4">
          <BudgetTrendLineChart data={monthlyBudgetTrendData} currentYear={selectedYear} />
        </div>
      </div>

      <div className="row">
        {/* Budget vs. Actual Expenses Bar Chart */}
        <div className="col-12 mb-4">
          <BudgetVsActualBarChart data={budgetVsActualData} currentYear={selectedYear} />
        </div>
      </div>

    </div>
  );
};

export default BudgetAnalyticsPage;
