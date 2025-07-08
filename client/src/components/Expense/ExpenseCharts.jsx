// src/components/Expenses/ExpenseCharts.jsx
import React from 'react';
import CategoryPieChart from './charts/CategoryPieChart';
import MonthlyBarChart from './charts/MonthlyBarChart';
import YearlyLineChart from './charts/YearlyLineChart';
import SkeletonLoader from '../common/SkeletonLoader';

/**
 * Container component for displaying various charts related to expenses.
 * @param {object} props - Component props.
 * @param {Array<Object>} props.summaryByCategory - Aggregated data for category pie chart.
 * @param {Array<Object>} props.monthlySummary - Aggregated data for monthly bar chart.
 * @param {Array<Object>} props.yearlySummary - Aggregated data for yearly line chart.
 * @param {boolean} props.isLoading - Loading state from the parent hook.
 */
const ExpenseCharts = ({ summaryByCategory, monthlySummary, yearlySummary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="row">
        <div className="col-md-6 mb-4"><SkeletonLoader type="card" className="h-100" /></div>
        <div className="col-md-6 mb-4"><SkeletonLoader type="card" className="h-100" /></div>
        <div className="col-md-12 mb-4"><SkeletonLoader type="card" className="h-100" /></div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg mb-4 bg-light-subtle" style={{ borderRadius: '15px' }}>
      <div className="card-header bg-gradient-success text-white border-bottom-0" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
        <h5 className="mb-0 text-center">Expense Trends & Breakdowns</h5>
      </div>
      <div className="card-body p-4">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body">
                <h6 className="card-title text-center text-success mb-3">Expenses by Category</h6>
                <CategoryPieChart data={summaryByCategory} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body">
                <h6 className="card-title text-center text-success mb-3">Monthly Expenses</h6>
                <MonthlyBarChart data={monthlySummary} />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="card h-100 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body">
                <h6 className="card-title text-center text-success mb-3">Yearly Expenses Trend</h6>
                <YearlyLineChart data={yearlySummary} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;
