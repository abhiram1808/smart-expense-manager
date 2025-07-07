// src/hooks/useMonthlyIncomeBySourceData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchIncomeBySourceMonthly } from '../services/incomeService'; // Import the new service function

/**
 * Custom hook to fetch and transform monthly income data grouped by source.
 * Prepares data for a grouped bar chart where each month has bars for different sources.
 *
 * @param {number} year - The year for which to fetch data.
 * @returns {object} An object containing:
 * - data: An array of objects, each representing a month with total income per source.
 * Example: [{ name: 'Jan', Salary: 1000, Freelance: 500, Investments: 200 }, ...]
 * - sources: An array of unique income source names found in the data.
 * - isLoading: Boolean indicating if data is currently being fetched.
 * - error: Any error object encountered during fetching.
 */
const useMonthlyIncomeBySourceData = (year) => {
  const [data, setData] = useState([]);
  const [sources, setSources] = useState([]); // To store unique source names for chart keys
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
      console.log(`useMonthlyIncomeBySourceData: Fetching monthly income by source for year ${year}...`);
      const res = await fetchIncomeBySourceMonthly(year);
      const rawData = res.data; // Expected: [{ month: 1, source: 'Salary', totalAmount: 50000 }, ...]
      console.log('useMonthlyIncomeBySourceData: Raw API response:', rawData);

      // --- Data Transformation for Recharts Grouped Bar Chart ---
      const transformedDataMap = new Map();
      const uniqueSources = new Set();

      // Initialize map with all months and default 0 for all sources
      monthNames.forEach((monthName, index) => {
        transformedDataMap.set(index + 1, { name: monthName });
      });

      rawData.forEach(item => {
        if (item.month && item.source && typeof item.totalAmount === 'number') {
          const monthData = transformedDataMap.get(item.month);
          if (monthData) {
            monthData[item.source] = (monthData[item.source] || 0) + item.totalAmount; // Sum amounts for same source in same month
            uniqueSources.add(item.source);
          }
        } else {
          console.warn('useMonthlyIncomeBySourceData: Skipping malformed item:', item);
        }
      });

      // Convert map values to array and ensure all months are present
      const finalData = Array.from(transformedDataMap.values()).sort((a, b) => {
        // Sort by month number (implicitly by the order they were added to map if month name is the key)
        // Or, if month names are not unique, add a month number property to sort explicitly.
        const monthOrderA = monthNames.indexOf(a.name);
        const monthOrderB = monthNames.indexOf(b.name);
        return monthOrderA - monthOrderB;
      });

      // Ensure all sources are present in each month's object, even if 0
      finalData.forEach(monthItem => {
        uniqueSources.forEach(sourceName => {
          if (monthItem[sourceName] === undefined) {
            monthItem[sourceName] = 0;
          }
        });
      });

      setData(finalData);
      setSources(Array.from(uniqueSources).sort()); // Convert set to sorted array for consistent legend/colors
      console.log('useMonthlyIncomeBySourceData: Transformed data for chart:', finalData);
      console.log('useMonthlyIncomeBySourceData: Unique sources:', Array.from(uniqueSources));

    } catch (err) {
      console.error('❌ useMonthlyIncomeBySourceData: Error fetching monthly income by source data:', err);
      setError(err);
      setData([]);
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, sources, isLoading, error };
};

export default useMonthlyIncomeBySourceData;
