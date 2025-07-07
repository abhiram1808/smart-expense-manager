// src/components/Analytics/IncomeSourceMonthlyBarChart.jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// A set of distinct colors for the bars
const BAR_COLORS = [
  '#28a745', // Green
  '#007bff', // Blue
  '#ffc107', // Yellow
  '#dc3545', // Red
  '#6f42c1', // Purple
  '#fd7e14', // Orange
  '#20c997', // Teal
  '#e83e8c', // Pink
  '#6610f2', // Indigo
  '#17a2b8', // Cyan
  '#6c757d'  // Gray
];

/**
 * Renders a bar chart showing income by source, month by month, for a given year.
 * @param {Array<Object>} data - Transformed data from useMonthlyIncomeBySourceData hook.
 * Example: [{ name: 'Jan', Salary: 1000, Freelance: 500 }, ...]
 * @param {Array<string>} sources - Array of unique income source names (e.g., ['Salary', 'Freelance']).
 * @param {string|number} currentYear - The year for which the chart is displayed.
 */
const IncomeSourceMonthlyBarChart = ({ data, sources, currentYear }) => {
  if (!data || data.length === 0 || sources.length === 0 || data.every(monthData => sources.every(source => monthData[source] === 0))) {
    return (
      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="mb-0">Monthly Income by Source for {currentYear}</h5>
        </div>
        <div className="card-body">
          <p className="text-muted text-center mt-4">No income data available for {currentYear} to display monthly breakdown by source.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Monthly Income by Source for {currentYear}</h5>
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
            <XAxis dataKey="name" /> {/* 'name' is the month abbreviation */}
            <YAxis />
            <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
            <Legend />
            {sources.map((sourceName, index) => (
              <Bar
                key={sourceName}
                dataKey={sourceName} // Data key matches the source name in the data objects
                fill={BAR_COLORS[index % BAR_COLORS.length]}
                name={sourceName} // Name for the legend
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeSourceMonthlyBarChart;
