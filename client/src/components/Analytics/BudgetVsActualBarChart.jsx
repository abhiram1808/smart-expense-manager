// src/components/Analytics/BudgetVsActualBarChart.jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

/**
 * Renders a bar chart comparing monthly budgeted amounts against actual expenses.
 * @param {Array<Object>} data - Data from `useBudgetVsActualData` hook.
 * Expects data in the format: [{ name: 'Jan', budgeted: 1200, actual: 800 }, ...]
 * @param {string|number} currentYear - The year for which the chart is displayed.
 */
const BudgetVsActualBarChart = ({ data, currentYear }) => {
  if (!data || data.length === 0 || data.every(d => d.budgeted === 0 && d.actual === 0)) {
    return (
      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-info text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="mb-0">Budget vs. Actual Expenses for {currentYear}</h5>
        </div>
        <div className="card-body">
          <p className="text-muted text-center mt-4">No budget or expense data available for {currentYear} to display comparison.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-info text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Budget vs. Actual Expenses for {currentYear}</h5>
      </div>
      <div className="card-body" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
            <Legend />
            <Bar dataKey="budgeted" fill="#007bff" name="Budgeted Amount" /> {/* Blue for Budget */}
            <Bar dataKey="actual" fill="#dc3545" name="Actual Expense" /> {/* Red for Actual */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetVsActualBarChart;
