// src/hooks/useIncomeBySourceData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchIncomeSummaryBySource } from '../services/incomeService'; // Ensure this service function exists

/**
 * Custom hook to fetch income data aggregated by source for a given year.
 * This data is typically used for pie charts showing income distribution.
 *
 * @param {number} year - The year for which to fetch data.
 * @returns {object} An object containing:
 * - data: An array of objects, each representing an income source with its total amount.
 * Example: [{ source: 'Salary', totalAmount: 50000 }, ...]
 * - isLoading: Boolean indicating if data is currently being fetched.
 * - error: Any error object encountered during fetching.
 */
const useIncomeBySourceData = (year) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`useIncomeBySourceData: Fetching income summary by source for year ${year}...`);
      const res = await fetchIncomeSummaryBySource(year);
      const incomeSummary = res.data;
      console.log('useIncomeBySourceData: Income summary by source received:', incomeSummary);

      // Ensure data is in the format expected by the Pie Chart: { name: 'Source', value: totalAmount }
      // The backend `getIncomeSummaryBySource` already returns { source: '...', totalAmount: ... }
      // so we just map 'source' to 'name' and 'totalAmount' to 'value'.
      const formattedData = incomeSummary.map(item => ({
        name: item.source,
        value: item.totalAmount,
      }));

      setData(formattedData);
      console.log('useIncomeBySourceData: Formatted data for chart:', formattedData);

    } catch (err) {
      console.error('❌ useIncomeBySourceData: Error fetching income by source data:', err);
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

export default useIncomeBySourceData;
