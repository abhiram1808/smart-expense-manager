// src/components/Income/MonthlyIncomeSummary.jsx
import React from 'react';

/**
 * Displays a table summarizing total income per month for a given year.
 * @param {object} props - Component props.
 * @param {Array<Object>} props.monthlySummary - An array of objects, each representing a month's summary.
 * Example: [{ month: 1, totalAmount: 1500, count: 5 }, ...]
 * @param {string|number} props.currentYear - The year for which the summary is displayed.
 */
const MonthlyIncomeSummary = ({ monthlySummary, currentYear }) => {
  // Array of month names for display
  const monthNames = [
    'January', 'February', 'März', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (!monthlySummary || monthlySummary.length === 0 || monthlySummary.every(m => m.totalAmount === 0)) {
    return (
      <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          <h5 className="mb-0">Monthly Income Summary for {currentYear}</h5>
        </div>
        <div className="card-body">
          <p className="text-muted text-center mt-3">No income data found for {currentYear} to display summary.</p>
        </div>
      </div>
    );
  }

  // Calculate overall total for the year
  const overallTotal = monthlySummary.reduce((sum, monthData) => sum + (monthData.totalAmount || 0), 0);

  return (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header bg-success text-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
        <h5 className="mb-0">Monthly Income Summary for {currentYear}</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Month</th>
                <th className="text-end">Total Income (₹)</th>
                <th className="text-end">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map((monthData) => (
                <tr key={monthData.month}>
                  <td>{monthNames[monthData.month - 1]}</td> {/* Convert 1-indexed month to name */}
                  <td className="text-end">
                    ₹{monthData.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="text-end">{monthData.count}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-dark">
              <tr>
                <th>Overall Total</th>
                <th className="text-end">
                  ₹{overallTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </th>
                <th></th> {/* Empty cell for alignment */}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlyIncomeSummary;
