// client/src/pages/CommonExpenseAnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  fetchCommonExpenseSummaryByCategory,
  fetchCommonExpenseSummaryByDayOfMonth,
  fetchTotalActiveCommonExpensesAmount,
} from '../services/commonExpenseService'; // Import recurring expense analytics services
import ErrorDisplay from '../components/common/ErrorDisplay';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { FaChartBar, FaChartPie, FaCalendarDay, FaSyncAlt } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

const CommonExpenseAnalyticsPage = () => {
  const [totalActiveAmount, setTotalActiveAmount] = useState(0);
  const [categorySummary, setCategorySummary] = useState([]);
  const [dayOfMonthSummary, setDayOfMonthSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          totalActiveRes,
          categoryRes,
          dayOfMonthRes,
        ] = await Promise.all([
          fetchTotalActiveCommonExpensesAmount(),
          fetchCommonExpenseSummaryByCategory(),
          fetchCommonExpenseSummaryByDayOfMonth(),
        ]);

        setTotalActiveAmount(totalActiveRes.data.totalAmount || 0);
        setCategorySummary(categoryRes.data || []);
        setDayOfMonthSummary(dayOfMonthRes.data || []);

      } catch (err) {
        console.error('Error fetching recurring expense analytics:', err.response?.data || err.message);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getAnalytics();
  }, []); // Run once on component mount

  if (isLoading) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary"><FaSyncAlt className="me-2" />Recurring Expense Analytics</h2>
        <SkeletonLoader count={3} type="card" className="mb-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary"><FaSyncAlt className="me-2" />Recurring Expense Analytics</h2>
        <ErrorDisplay error={error} message="Failed to load recurring expense analytics." />
      </div>
    );
  }

  // Category Recurring Expense Chart Data
  const categoryChartData = {
    labels: categorySummary.map(item => item._id),
    datasets: [
      {
        label: 'Recurring Amount by Category',
        data: categorySummary.map(item => item.totalAmount),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#8AC926', '#1982C4', '#6A4C93'
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Day of Month Recurring Expense Chart Data
  const dayOfMonthChartData = {
    labels: dayOfMonthSummary.map(item => `Day ${item._id}`),
    datasets: [
      {
        label: 'Recurring Amount by Day of Month',
        data: dayOfMonthSummary.map(item => item.totalAmount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary"><FaSyncAlt className="me-2" />Recurring Expense Analytics</h2>

      <div className="row">
        {/* Total Active Recurring Amount */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body d-flex flex-column justify-content-between">
              <h5 className="card-title text-primary d-flex align-items-center mb-3">
                <FaChartBar className="me-2" /> Total Active Recurring Amount
              </h5>
              <p className="card-text fs-3 fw-bold text-center">
                ₹{totalActiveAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-muted text-center mb-0">Sum of all active recurring expense templates per month.</p>
            </div>
          </div>
        </div>

        {/* Recurring by Category Pie Chart */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <h5 className="card-title text-primary d-flex align-items-center mb-3">
                <FaChartPie className="me-2" /> Recurring by Category
              </h5>
              {categorySummary.length > 0 ? (
                <Pie data={categoryChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Recurring Expenses by Category' } } }} />
              ) : (
                <p className="text-muted text-center mt-4">No recurring expense data by category.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recurring by Day of Month Bar Chart */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <h5 className="card-title text-primary d-flex align-items-center mb-3">
                <FaCalendarDay className="me-2" /> Recurring by Day of Month
              </h5>
              {dayOfMonthSummary.length > 0 ? (
                <Bar data={dayOfMonthChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Recurring Expenses by Day of Month' } } }} />
              ) : (
                <p className="text-muted text-center mt-4">No recurring expense data by day of month.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonExpenseAnalyticsPage;
