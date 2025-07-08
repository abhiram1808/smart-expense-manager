// src/components/Expenses/charts/CategoryPieChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// A modern and accessible color palette for expense categories
const COLORS = [
  '#FF6B6B', // Reddish
  '#4ECDC4', // Teal
  '#45B7D1', // Sky Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint Green
  '#B8D8D8', // Light Grey Blue
  '#7B68EE', // Medium Slate Blue
  '#FFD700', // Gold
  '#DA70D6', // Orchid
  '#6A5ACD', // Slate Blue
  '#F08080', // Light Coral
  '#20B2AA', // Light Sea Green
  '#87CEEB', // Sky Blue (lighter)
  '#FF7F50', // Coral
  '#C71585'  // Medium Violet Red
];

/**
 * Renders a Pie Chart for expense distribution by category.
 * @param {object} props - Component props.
 * @param {Array<Object>} props.data - Array of objects like [{ category: 'Groceries', totalAmount: 12000, count: 5 }]
 */
const CategoryPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted p-4">No category data to display chart.</div>;
  }

  // Filter out categories with 0 totalAmount for cleaner chart
  const chartData = data.filter(item => item.totalAmount > 0);

  if (chartData.length === 0) {
    return <div className="text-center text-muted p-4">No active expense data for chart.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="totalAmount"
          nameKey="category" // Use category for tooltip name
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={1} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          labelFormatter={(label) => `Category: ${label}`}
          contentStyle={{ backgroundColor: '#343a40', border: 'none', borderRadius: '8px', color: '#ffffff' }}
          itemStyle={{ color: '#ffffff' }}
        />
        <Legend
          verticalAlign="bottom"
          align="center"
          layout="horizontal"
          wrapperStyle={{ paddingTop: '10px' }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
