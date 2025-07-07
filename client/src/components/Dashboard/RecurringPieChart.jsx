import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RecurringPieChart = ({ recurring, nonRecurring }) => {
  const data = [
    { name: 'Recurring', value: recurring },
    { name: 'Non-Recurring', value: nonRecurring },
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <div className="card p-3 shadow-sm mt-4">
      <h5>📈 Recurring vs Non-Recurring</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={100} label dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RecurringPieChart;
