// src/components/Analytics/IncomeBySourcePieChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Define a set of colors for the pie chart slices
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666', '#66B2FF', '#FFD700', '#ADFF2F', '#FF69B4', '#8A2BE2'];

/**
 * Renders a Pie Chart showing income distribution by source.
 * @param {Array<Object>} data - An array of objects, each representing a source's total income.
 * Expects data in the format: [{ name: 'Salary', value: 50000 }, { name: 'Freelance', value: 10000 }]
 */
const IncomeBySourcePieChart = ({ data }) => {
  if (!data || data.length === 0 || data.every(d => d.value === 0)) {
    return (
      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="mb-0">Income Breakdown by Source</h5>
        </div>
        <div className="card-body">
          <p className="text-muted text-center mt-4">No income data available for this year to display by source.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Income Breakdown by Source</h5>
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
              dataKey="value" // The value to represent the slice size (from formatted data in hook)
              nameKey="name" // The name for the legend/tooltip (from formatted data in hook)
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

export default IncomeBySourcePieChart;
