// src/components/CommonExpenses/CommonExpenseCharts.jsx
import React from 'react';
import CategoryPieChart from './charts/CategoryPieChart';
import DayOfMonthBarChart from './charts/DayOfMonthBarChart';
import SkeletonLoader from '../common/SkeletonLoader';

/**
 * Container component for displaying various charts related to common expenses.
 * @param {object} props - Component props.
 * @param {Array<Object>} props.summaryByCategory - Aggregated data for category pie chart.
 * @param {Array<Object>} props.summaryByDay - Aggregated data for day of month bar chart.
 * @param {boolean} props.isLoading - Loading state from the parent hook.
 */
const CommonExpenseCharts = ({ summaryByCategory, summaryByDay, isLoading }) => {
  if (isLoading) {
    return (
      <div className="row">
        <div className="col-md-6 mb-4"><SkeletonLoader type="card" className="h-100" /></div>
        <div className="col-md-6 mb-4"><SkeletonLoader type="card" className="h-100" /></div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg mb-4 bg-light-subtle" style={{ borderRadius: '15px' }}> {/* More pronounced shadow and subtle background */}
      <div className="card-header bg-gradient-info text-white border-bottom-0" style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
        <h5 className="mb-0 text-center">Recurring Expense Trends & Breakdowns</h5>
      </div>
      <div className="card-body p-4"> {/* Increased padding */}
        <div className="row g-4"> {/* Increased gap between columns */}
          <div className="col-md-6">
            <div className="card h-100 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body">
                <h6 className="card-title text-center text-primary mb-3">Expenses by Category</h6>
                <CategoryPieChart data={summaryByCategory} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body">
                <h6 className="card-title text-center text-primary mb-3">Expenses by Due Day</h6>
                <DayOfMonthBarChart data={summaryByDay} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonExpenseCharts;
