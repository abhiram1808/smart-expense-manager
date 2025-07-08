// src/components/Expenses/charts/MonthlyBarChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * Renders a Bar Chart for total expenses per month.
 * @param {object} props - Component props.
 * @param {Array<Object>} props.data - Array of objects like [{ month: 1, totalAmount: 12000, count: 5 }]
 */
const MonthlyBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted p-4">No monthly data to display chart.</div>;
  }

  // Ensure all 12 months are present, filling missing months with 0
  const fullYearData = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const existing = data.find(item => item.month === monthNum);
    return {
      month: monthNum,
      name: new Date(2000, i, 1).toLocaleString('en-US', { month: 'short' }), // Get short month name
      totalAmount: existing ? existing.totalAmount : 0
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={fullYearData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
        <XAxis dataKey="name" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', offset: 10 }} formatter={(value) => value.toLocaleString('en-IN')} />
        <Tooltip
          formatter={(value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          labelFormatter={(label) => `Month: ${label}`}
          contentStyle={{ backgroundColor: '#343a40', border: 'none', borderRadius: '8px', color: '#ffffff' }}
          itemStyle={{ color: '#ffffff' }}
        />
        <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="rect" />
        <Bar dataKey="totalAmount" fill="#FF6B6B" name="Total Expense" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyBarChart;
