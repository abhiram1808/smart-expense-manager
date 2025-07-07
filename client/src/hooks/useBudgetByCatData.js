// src/hooks/useBudgetByCatData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchBudgetSummaryByCategory } from '../services/budgetService'; // Ensure this service function exists

/**
 * Custom hook to fetch budget data aggregated by category for a given year.
 * This data is typically used for pie charts showing budget allocation.
 *
 * @param {number} year - The year for which to fetch data.
 * @returns {object} An object containing:
 * - data: An array of objects, each representing a budget category with its total amount.
 * Example: [{ name: 'Groceries', value: 5000 }, { name: 'Rent', value: 20000 }]
 * - isLoading: Boolean indicating if data is currently being fetched.
 * - error: Any error object encountered during fetching.
 */
const useBudgetByCatData = (year) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`useBudgetByCatData: Fetching budget summary by category for year ${year}...`);
      const res = await fetchBudgetSummaryByCategory(year);
      const budgetSummary = res.data;
      console.log('useBudgetByCatData: Budget summary by category received:', budgetSummary);

      // Ensure data is in the format expected by the Pie Chart: { name: 'Category', value: totalAmount }
      const formattedData = budgetSummary.map(item => ({
        name: item.category,
        value: item.totalAmount,
      }));

      setData(formattedData);
      console.log('useBudgetByCatData: Formatted data for chart:', formattedData);

    } catch (err) {
      console.error('❌ useBudgetByCatData: Error fetching budget by category data:', err);
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

export default useBudgetByCatData;
