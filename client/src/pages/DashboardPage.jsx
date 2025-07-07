import React, { useEffect, useState } from 'react';
import {
  fetchIncomes
} from '../services/incomeService';
import {
  fetchBudgets
} from '../services/budgetService';
import {
  fetchExpenses
} from '../services/expenseService';

import ExpenseAlerts from '../components/Common/ExpenseAlerts';
import IncomeCard from '../components/Dashboard/IncomeCard';
import BudgetCard from '../components/Dashboard/BudgetCard';
import ExpenseCard from '../components/Dashboard/ExpenseCard';
import BalanceCard from '../components/Dashboard/BalanceCard';
import RecurringPieChart from '../components/Dashboard/RecurringPieChart';

const INITIAL_SUMMARY = {
  income: null,
  budget: null,
  expenses: null,
  recurring: null,
  nonRecurring: null,
};

const DashboardPage = () => {
  const [summary, setSummary] = useState(INITIAL_SUMMARY);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const incomeRes = await fetchIncomes();
        const budgetRes = await fetchBudgets();
        const expenseRes = await fetchExpenses();

        // Debug: log API responses
        console.log('Income response:', incomeRes);
        console.log('Budget response:', budgetRes);
        console.log('Expenses response:', expenseRes);

        // Ensure expenses is always an array
        const expensesArray = Array.isArray(expenseRes) ? expenseRes : (expenseRes.expenses || []);
        const { recurring, nonRecurring } = expensesArray.reduce(
          (acc, e) => {
            if (e.isRecurring) {
              acc.recurring += 1;
            } else {
              acc.nonRecurring += 1;
            }
            return acc;
          },
          { recurring: 0, nonRecurring: 0 }
        );
        const totalExpenses = expensesArray.reduce((sum, e) => sum + (e.amount || 0), 0);

        setSummary({
          income: incomeRes.amount || incomeRes.total || 0,
          budget: budgetRes.amount || budgetRes.total || 0,
          expenses: totalExpenses,
          recurring,
          nonRecurring,
        });
      } catch (err) {
        if (err.response) {
          // Server responded with a status other than 2xx
          console.error('Dashboard summary fetch failed with response:', err.response.data, 'Status:', err.response.status);
        } else if (err.request) {
          // Request was made but no response received
          console.error('Dashboard summary fetch made but no response received:', err.request);
        } else {
          // Something else happened
          console.error('Unexpected error fetching dashboard summary:', err.message);
        }
      }
    };

    fetchSummary();
  }, []);

  const balance = summary.income - summary.expenses;

  return (
    <div className="container mt-3">
      <h2>📊 Dashboard</h2>

      <ExpenseAlerts />

      <div className="row mb-4">
        <IncomeCard amount={summary.income} />
        <BudgetCard amount={summary.budget} />
        <ExpenseCard amount={summary.expenses} />
        <BalanceCard balance={balance} />
      </div>

      <RecurringPieChart
        recurring={summary.recurring}
        nonRecurring={summary.nonRecurring}
      />
    </div>
  );
};

export default DashboardPage;

