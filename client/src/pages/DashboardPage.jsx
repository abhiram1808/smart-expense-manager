// client/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ExpenseCard from '../components/Dashboard/ExpenseCard';
import IncomeCard from '../components/Dashboard/IncomeCard';
import BudgetCard from '../components/Dashboard/BudgetCard';
import BalanceCard from '../components/Dashboard/BalanceCard';
import RecurringPieChart from '../components/Dashboard/RecurringPieChart'; // Assuming this exists
import ExpenseAlerts from '../components/common/ExpenseAlerts'; // Assuming this exists
import SpendingInsightsCard from '../components/Dashboard/SpendingInsightsCard'; // <--- NEW IMPORT

// Service imports (ensure these exist and are correct)
import { fetchExpenseSummaryByCategory, fetchMonthlyExpenseSummary } from '../services/expenseService';
import { fetchIncomeSummaryByCategory, fetchMonthlyIncomeSummary } from '../services/incomeService';
import { fetchBudgetSummaryByCategory, fetchMonthlyBudgetSummary } from '../services/budgetService';
import { fetchTotalActiveCommonExpensesAmount } from '../services/commonExpenseService';

import ErrorDisplay from '../components/common/ErrorDisplay';
import SkeletonLoader from '../components/common/SkeletonLoader';

const DashboardPage = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalExpensesCurrentMonth: 0,
    totalIncomeCurrentMonth: 0,
    totalBudgetCurrentMonth: 0,
    totalRecurringExpenses: 0,
    // Add more states as needed for other cards
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch data for ExpenseCard, IncomeCard, BudgetCard, BalanceCard
        const [
          expenseSummaryRes,
          incomeSummaryRes,
          budgetSummaryRes,
          recurringExpensesRes,
        ] = await Promise.all([
          fetchExpenseSummaryByCategory(currentYear, currentMonth), // Or a specific total for the month
          fetchIncomeSummaryByCategory(currentYear, currentMonth),   // Or a specific total for the month
          fetchBudgetSummaryByCategory(currentYear, currentMonth),   // Or a specific total for the month
          fetchTotalActiveCommonExpensesAmount(),
        ]);

        const totalExpenses = expenseSummaryRes.data.reduce((sum, item) => sum + item.totalAmount, 0);
        const totalIncome = incomeSummaryRes.data.reduce((sum, item) => sum + item.totalAmount, 0);
        const totalBudget = budgetSummaryRes.data.reduce((sum, item) => sum + item.totalBudgeted, 0);
        const totalRecurring = recurringExpensesRes.data.totalAmount || 0;

        setDashboardData({
          totalExpensesCurrentMonth: totalExpenses,
          totalIncomeCurrentMonth: totalIncome,
          totalBudgetCurrentMonth: totalBudget,
          totalRecurringExpenses: totalRecurring,
        });

      } catch (err) {
        console.error('Error loading dashboard data:', err.response?.data || err.message);
        setError(err);
        toast.error(`Failed to load dashboard data: ${err.response?.data?.error || err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [currentMonth, currentYear]); // Re-fetch if month/year changes

  if (isLoading) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary"><FaTachometerAlt className="me-2" />Dashboard</h2>
        <div className="row">
          <div className="col-md-6 mb-4"><SkeletonLoader type="card" /></div>
          <div className="col-md-6 mb-4"><SkeletonLoader type="card" /></div>
          <div className="col-md-6 mb-4"><SkeletonLoader type="card" /></div>
          <div className="col-md-6 mb-4"><SkeletonLoader type="card" /></div>
          <div className="col-md-12 mb-4"><SkeletonLoader type="card" /></div> {/* For AI Insights */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary"><FaTachometerAlt className="me-2" />Dashboard</h2>
        <ErrorDisplay error={error} message="Failed to load dashboard data." />
      </div>
    );
  }

  const currentBalance = dashboardData.totalIncomeCurrentMonth - dashboardData.totalExpensesCurrentMonth;
  const budgetRemaining = dashboardData.totalBudgetCurrentMonth - dashboardData.totalExpensesCurrentMonth;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary"><FaTachometerAlt className="me-2" />Dashboard</h2>

      {/* Row for main financial overview cards */}
      <div className="row mb-4">
        <div className="col-md-6 col-lg-3 mb-4">
          <IncomeCard totalIncome={dashboardData.totalIncomeCurrentMonth} />
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <ExpenseCard totalExpenses={dashboardData.totalExpensesCurrentMonth} />
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <BudgetCard totalBudget={dashboardData.totalBudgetCurrentMonth} budgetRemaining={budgetRemaining} />
        </div>
        <div className="col-md-6 col-lg-3 mb-4">
          <BalanceCard currentBalance={currentBalance} />
        </div>
      </div>

      {/* Row for Recurring Expenses and AI Insights */}
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <RecurringPieChart totalRecurringExpenses={dashboardData.totalRecurringExpenses} />
        </div>
        <div className="col-md-6 mb-4">
          <SpendingInsightsCard /> {/* <--- NEW: Integrate AI Insights Card */}
        </div>
      </div>

      {/* Expense Alerts (if any) */}
      <div className="row">
        <div className="col-12">
          <ExpenseAlerts />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
