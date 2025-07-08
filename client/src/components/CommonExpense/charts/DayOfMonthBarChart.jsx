// src/components/CommonExpenses/charts/CategoryPieChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// A more modern and accessible color palette
const COLORS = [
  '#4A90E2', // Blue
  '#50E3C2', // Teal
  '#F5A623', // Orange
  '#BD10E0', // Purple
  '#FF5733', // Red-Orange
  '#00B8D9', // Light Blue
  '#FFC107', // Amber
  '#7ED321', // Lime Green
  '#9B59B6', // Darker Purple
  '#F8E71C', // Yellow
  '#417505', // Dark Green
  '#D0021B', // Dark Red
  '#F9A825'  // Gold
];

/**
 * Renders a Pie Chart for common expense distribution by category.
 * @param {object} props - Component props.
 * @param {Array<Object>} props.data - Array of objects like [{ category: 'Rent', totalAmount: 12000, count: 5 }]
 */
const CategoryPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted p-4">No category data to display chart.</div>;
  }

  // Filter out categories with 0 totalAmount for cleaner chart
  const chartData = data.filter(item => item.totalAmount > 0);

  if (chartData.length === 0) {
    return <div className="text-center text-muted p-4">No active common expense data for chart.</div>;
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
          // Custom label for better positioning and styling
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
            return (
              <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
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
