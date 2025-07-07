// src/hooks/useBudgetVsActualData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchMonthlyBudgetSummary } from '../services/budgetService';
import { fetchMonthlyExpenseSummary } from '../services/expenseService'; // Need expense service for actuals

/**
 * Custom hook to fetch and combine monthly budget and actual expense data for a given year.
 * This data is used for comparison charts (e.g., Budget vs. Actual Bar Chart).
 *
 * @param {number} year - The year for which to fetch data.
 * @returns {object} An object containing:
 * - data: An array of objects, each representing a month with budget and actual expense totals.
 * Example: [{ name: 'Jan', budgeted: 1200, actual: 800 }, ...]
 * - isLoading: Boolean indicating if data is currently being fetched.
 * - error: Any error object encountered during fetching.
 */
const useBudgetVsActualData = (year) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch monthly budget summary
      console.log(`useBudgetVsActualData: Fetching budget summary for year ${year}...`);
      const budgetRes = await fetchMonthlyBudgetSummary(year);
      const budgetSummary = budgetRes.data;
      console.log('useBudgetVsActualData: Budget summary received:', budgetSummary);

      // Fetch monthly expense summary (actual expenses)
      console.log(`useBudgetVsActualData: Fetching expense summary for year ${year}...`);
      const expenseRes = await fetchMonthlyExpenseSummary(year);
      const expenseSummary = expenseRes.data;
      console.log('useBudgetVsActualData: Expense summary received:', expenseSummary);

      // Combine data
      const combinedData = monthNames.map((monthName, index) => {
        const monthNum = index + 1; // 1-indexed month
        const budgetForMonth = budgetSummary.find(item => item.month === monthNum);
        const expenseForMonth = expenseSummary.find(item => item.month === monthNum);

        return {
          name: monthName,
          budgeted: budgetForMonth ? budgetForMonth.totalAmount : 0,
          actual: expenseForMonth ? expenseForMonth.totalAmount : 0,
        };
      });

      setData(combinedData);
      console.log('useBudgetVsActualData: Combined data for chart:', combinedData);

    } catch (err) {
      console.error('❌ useBudgetVsActualData: Error fetching budget vs actual data:', err);
      setError(err);
      setData([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [year]); // Re-run fetchData if the year changes

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error };
};

export default useBudgetVsActualData;
