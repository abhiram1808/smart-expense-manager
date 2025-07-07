// src/hooks/useMonthlyOverviewData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchMonthlyIncomeSummary } from '../services/incomeService';
import { fetchMonthlyExpenseSummary } from '../services/expenseService';

/**
 * Custom hook to fetch and combine monthly income and expense data for a given year.
 * This data is typically used for overview charts (e.g., bar charts comparing income vs expense).
 *
 * @param {number} year - The year for which to fetch data.
 * @returns {object} An object containing:
 * - data: An array of objects, each representing a month with income and expense totals.
 * Example: [{ name: 'Jan', income: 1200, expense: 800 }, ...]
 * - isLoading: Boolean indicating if data is currently being fetched.
 * - error: Any error object encountered during fetching.
 */
const useMonthlyOverviewData = (year) => {
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
      // Fetch monthly income summary
      console.log(`useMonthlyOverviewData: Fetching income summary for year ${year}...`);
      const incomeRes = await fetchMonthlyIncomeSummary(year);
      const incomeSummary = incomeRes.data;
      console.log('useMonthlyOverviewData: Income summary received:', incomeSummary);

      // Fetch monthly expense summary
      console.log(`useMonthlyOverviewData: Fetching expense summary for year ${year}...`);
      const expenseRes = await fetchMonthlyExpenseSummary(year);
      const expenseSummary = expenseRes.data;
      console.log('useMonthlyOverviewData: Expense summary received:', expenseSummary);

      // Combine data
      const combinedData = monthNames.map((monthName, index) => {
        const monthNum = index + 1; // 1-indexed month
        const incomeForMonth = incomeSummary.find(item => item.month === monthNum);
        const expenseForMonth = expenseSummary.find(item => item.month === monthNum);

        return {
          name: monthName,
          income: incomeForMonth ? incomeForMonth.totalAmount : 0,
          expense: expenseForMonth ? expenseForMonth.totalAmount : 0,
        };
      });

      setData(combinedData);
      console.log('useMonthlyOverviewData: Combined data for chart:', combinedData);

    } catch (err) {
      console.error('❌ useMonthlyOverviewData: Error fetching monthly overview data:', err);
      setError(err);
      setData([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [year]); // Re-run fetchData if the year changes

  useEffect(() => {
    fetchData();
  }, [fetchData]); // `fetchData` is a dependency, but it's memoized by useCallback

  return { data, isLoading, error };
};

export default useMonthlyOverviewData;
