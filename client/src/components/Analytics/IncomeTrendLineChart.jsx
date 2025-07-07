// src/components/Analytics/IncomeTrendLineChart.jsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

/**
 * Renders a line chart showing monthly income trends for a given year.
 * @param {Array<Object>} data - An array of objects, each representing a month's data.
 * This data should ideally come from `monthlyIncomeSummary` which has `month` and `totalAmount`.
 * The `useMonthlyOverviewData` hook already transforms this into `{ name: 'Jan', income: 1200, expense: 800 }`
 * so we can use the `income` key directly.
 * @param {string|number} currentYear - The year for which the trend is displayed.
 */
const IncomeTrendLineChart = ({ data, currentYear }) => {
  if (!data || data.length === 0 || data.every(d => d.income === 0)) {
    return (
      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="mb-0">Income Trend for {currentYear}</h5>
        </div>
        <div className="card-body">
          <p className="text-muted text-center mt-4">No income data available for {currentYear} to display trend.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Income Trend for {currentYear}</h5>
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
              dataKey="income"
              stroke="#28a745" // Green color for income
              activeDot={{ r: 8 }}
              name="Total Income"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeTrendLineChart;
