// src/components/Analytics/BudgetTrendLineChart.jsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

/**
 * Renders a line chart showing monthly budget trends for a given year.
 * @param {Array<Object>} data - An array of objects, each representing a month's data.
 * This data should come from `useMonthlyBudgetTrendData` which has `name` (month abbr) and `budget` keys.
 * @param {string|number} currentYear - The year for which the trend is displayed.
 */
const BudgetTrendLineChart = ({ data, currentYear }) => {
  if (!data || data.length === 0 || data.every(d => d.budget === 0)) {
    return (
      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-primary text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="mb-0">Budget Trend for {currentYear}</h5>
        </div>
        <div className="card-body">
          <p className="text-muted text-center mt-4">No budget data available for {currentYear} to display trend.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-primary text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Budget Trend for {currentYear}</h5>
      </div>
      <div className="card-body" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
            <Line
              type="monotone" // Smooth curve
              dataKey="budget"
              stroke="#007bff" // Blue color for budget
              activeDot={{ r: 8 }}
              name="Total Budget"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetTrendLineChart;
