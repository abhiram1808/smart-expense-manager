// src/components/Analytics/BudgetByCategoryPieChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Define a set of colors for the pie chart slices (can be extended)
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1', '#8856a7', '#9ebcda', '#e0f3db', '#fee08b'];

/**
 * Renders a Pie Chart showing budget distribution by category.
 * @param {Array<Object>} data - An array of objects, each representing a category's total budgeted amount.
 * Expects data in the format: [{ name: 'Groceries', value: 5000 }, { name: 'Rent', value: 20000 }]
 */
const BudgetByCategoryPieChart = ({ data }) => {
  if (!data || data.length === 0 || data.every(d => d.value === 0)) {
    return (
      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-primary text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="mb-0">Budget Breakdown by Category</h5>
        </div>
        <div className="card-body">
          <p className="text-muted text-center mt-4">No budget data available for this year to display by category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-primary text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Budget Breakdown by Category</h5>
      </div>
      <div className="card-body" style={{ height: '400px' }}> {/* Set a fixed height for the chart container */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" // Center X position
              cy="50%" // Center Y position
              labelLine={false}
              outerRadius={120} // Outer radius of the pie chart
              fill="#8884d8"
              dataKey="value" // The value to represent the slice size
              nameKey="name" // The name for the legend/tooltip
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Label format
            >
              {
                data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))
              }
            </Pie>
            <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} /> {/* Format tooltip values */}
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetByCategoryPieChart;
