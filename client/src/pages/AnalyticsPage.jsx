// src/pages/AnalyticsPage.jsx
import React, { useState, useMemo } from 'react';
import useMonthlyOverviewData from '../hooks/useMonthlyOverviewData'; // For Income vs Expense chart & monthly income summary
import useIncomeBySourceData from '../hooks/useIncomeBySourceData'; // For Income by Source Pie chart
import useMonthlyIncomeBySourceData from '../hooks/useMonthlyIncomeBySourceData'; // NEW: For Monthly Income by Source Bar Chart

//import MonthlyOverviewChart from '../components/Analytics/MonthlyOverviewChart'; // Income vs Expense chart component
import IncomeBySourcePieChart from '../components/Analytics/IncomeBySourcePieChart'; // Income by Source Pie chart component
import IncomeTrendLineChart from '../components/Analytics/IncomeTrendLineChart'; // Income Trend Line Chart
import IncomeSourceMonthlyBarChart from '../components/Analytics/IncomeSourceMonthlyBarChart'; // NEW: Monthly Income by Source Bar Chart

import SkeletonLoader from '../components/common/SkeletonLoader'; // For loading states

/**
 * The main Analytics Dashboard page.
 * Displays various financial charts and summaries.
 */
const AnalyticsPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // State for the year filter

  // Fetch data for Monthly Overview (Income vs Expense)
  const { data: monthlyOverviewData, isLoading: monthlyLoading, error: monthlyError } = useMonthlyOverviewData(selectedYear);

  // Fetch data for Income Breakdown by Source (Pie Chart)
  const { data: incomeBySourceData, isLoading: incomeSourceLoading, error: incomeSourceError } = useIncomeBySourceData(selectedYear);

  // NEW: Fetch data for Monthly Income by Source (Bar Chart)
  const {
    data: monthlyIncomeBySourceData,
    sources: monthlyIncomeSources, // Get unique sources for the chart legend
    isLoading: monthlyIncomeBySourceLoading,
    error: monthlyIncomeBySourceError
  } = useMonthlyIncomeBySourceData(selectedYear);

  // Determine overall loading and error states
  const loading = monthlyLoading || incomeSourceLoading || monthlyIncomeBySourceLoading;
  const error = monthlyError || incomeSourceError || monthlyIncomeBySourceError;

  // Calculate Yearly Income Total from monthlyOverviewData
  const yearlyIncomeTotal = useMemo(() => {
    if (!monthlyOverviewData || monthlyOverviewData.length === 0) {
      return 0;
    }
    return monthlyOverviewData.reduce((sum, monthData) => sum + (monthData.income || 0), 0);
  }, [monthlyOverviewData]);

  if (loading) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary">📊 Financial Analytics</h2>
        <div className="d-flex justify-content-end align-items-center mb-4">
          <SkeletonLoader count={1} type="text-line" className="w-25" />
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <SkeletonLoader count={1} type="card" /> {/* Skeleton for Yearly Total Card */}
          </div>
          <div className="col-md-8 mb-4">
            <SkeletonLoader count={1} type="card" /> {/* Skeleton for Monthly Overview Chart */}
          </div>
          <div className="col-md-6 mb-4">
            <SkeletonLoader count={1} type="card" /> {/* Skeleton for Pie Chart */}
          </div>
          <div className="col-md-6 mb-4">
            <SkeletonLoader count={1} type="card" /> {/* Skeleton for Income Trend Line Chart */}
          </div>
          <div className="col-12 mb-4"> {/* Skeleton for new Monthly Income by Source Bar Chart */}
            <SkeletonLoader count={1} type="card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading analytics: {error.message || 'Something went wrong.'}
        <p>Please check your browser console and backend server for details.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary">📊 Financial Analytics</h2>

      {/* Year Selector - applies to all charts on this page */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        <label htmlFor="analyticsYear" className="form-label mb-0 me-2">Select Year:</label>
        <input
          type="number"
          id="analyticsYear"
          className="form-control form-control-sm w-auto"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          min="2000"
          max={new Date().getFullYear() + 5}
        />
      </div>

      <div className="row">
        {/* Yearly Income Total Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100" style={{ borderRadius: '12px', backgroundColor: '#e9f7ef' }}>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h4 className="card-title text-success mb-3">Total Income {selectedYear}</h4>
              <p className="display-5 text-success mb-0">
                ₹{yearlyIncomeTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Income vs. Expense Chart */}
        {/* <div className="col-md-8 mb-4">
          <MonthlyOverviewChart data={monthlyOverviewData} />
        </div> */}
      </div>

      <div className="row">
        {/* Income Breakdown by Source Pie Chart */}
        <div className="col-md-6 mb-4">
          <IncomeBySourcePieChart data={incomeBySourceData} />
        </div>

        {/* Income Trend Line Chart */}
        <div className="col-md-6 mb-4">
          <IncomeTrendLineChart data={monthlyOverviewData} currentYear={selectedYear} />
        </div>
      </div>

      <div className="row">
        {/* NEW: Monthly Income by Source Bar Chart */}
        <div className="col-12 mb-4">
          <IncomeSourceMonthlyBarChart
            data={monthlyIncomeBySourceData}
            sources={monthlyIncomeSources}
            currentYear={selectedYear}
          />
        </div>
      </div>

      {/* You can add more analytics components here later */}
    </div>
  );
};

export default AnalyticsPage;
