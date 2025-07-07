// src/hooks/useMonthlyBudgetTrendData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchMonthlyBudgetSummary } from '../services/budgetService'; // Ensure this service function exists

/**
 * Custom hook to fetch monthly budget summary data for a given year.
 * This data is typically used for trend line charts.
 *
 * @param {number} year - The year for which to fetch data.
 * @returns {object} An object containing:
 * - data: An array of objects, each representing a month with total budget.
 * Example: [{ name: 'Jan', budget: 1200 }, ...]
 * - isLoading: Boolean indicating if data is currently being fetched.
 * - error: Any error object encountered during fetching.
 */
const useMonthlyBudgetTrendData = (year) => {
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
      console.log(`useMonthlyBudgetTrendData: Fetching monthly budget summary for year ${year}...`);
      const budgetRes = await fetchMonthlyBudgetSummary(year);
      const budgetSummary = budgetRes.data;
      console.log('useMonthlyBudgetTrendData: Budget summary received:', budgetSummary);

      // Combine data into chart-friendly format
      const combinedData = monthNames.map((monthName, index) => {
        const monthNum = index + 1; // 1-indexed month
        const budgetForMonth = budgetSummary.find(item => item.month === monthNum);

        return {
          name: monthName,
          budget: budgetForMonth ? budgetForMonth.totalAmount : 0,
        };
      });

      setData(combinedData);
      console.log('useMonthlyBudgetTrendData: Combined data for chart:', combinedData);

    } catch (err) {
      console.error('❌ useMonthlyBudgetTrendData: Error fetching monthly budget trend data:', err);
      setError(err);
      setData([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error };
};

export default useMonthlyBudgetTrendData;
