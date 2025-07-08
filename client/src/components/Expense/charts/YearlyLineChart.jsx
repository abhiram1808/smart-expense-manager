// src/components/Expenses/charts/YearlyLineChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * Renders a Line Chart for total expenses per year.
 * @param {object} props - Component props.
 * @param {Array<Object>} props.data - Array of objects like [{ year: 2023, totalAmount: 120000, count: 100 }]
 */
const YearlyLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted p-4">No yearly data to display chart.</div>;
  }

  // Sort data by year for proper line chart order
  const sortedData = [...data].sort((a, b) => a.year - b.year);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={sortedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
        <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', offset: 10 }} formatter={(value) => value.toLocaleString('en-IN')} />
        <Tooltip
          formatter={(value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          labelFormatter={(label) => `Year: ${label}`}
          contentStyle={{ backgroundColor: '#343a40', border: 'none', borderRadius: '8px', color: '#ffffff' }}
          itemStyle={{ color: '#ffffff' }}
        />
        <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="line" />
        <Line type="monotone" dataKey="totalAmount" stroke="#4ECDC4" activeDot={{ r: 8 }} name="Total Expense" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default YearlyLineChart;
