// src/hooks/useExpenseData.js
import { useEffect, useState, useCallback } from 'react';
import { fetchGroupedExpensesByMonth } from '../services/expenseService'; // Import the service function

/**
 * Custom hook for managing expense data, specifically for the grouped-by-month view.
 * Handles data fetching, loading, error states, and year selection.
 */
const useExpenseData = () => {
  const [groupedExpenses, setGroupedExpenses] = useState([]); // State to hold the grouped expense data
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString()); // State for the selected year
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // useCallback memoizes the fetch function to prevent unnecessary re-creations
  const loadGroupedExpenseData = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear any previous errors

    try {
      console.log(`useExpenseData: Attempting to fetch grouped expenses for year: ${currentYear}...`);
      const res = await fetchGroupedExpensesByMonth(parseInt(currentYear)); // Call the service
      console.log('useExpenseData: Raw API Response for grouped expenses:', res.data);

      // Validate if the data is an array before setting state
      if (Array.isArray(res.data)) {
        setGroupedExpenses(res.data); // Update the state with fetched data
        console.log('useExpenseData: groupedExpenses state updated with', res.data.length, 'groups.');
      } else {
        // Log an error if the data format is unexpected
        console.error('useExpenseData: API response for grouped expenses is not an array:', res.data);
        setError(new Error('Received unexpected data format from backend for grouped expenses.'));
        setGroupedExpenses([]); // Ensure state is an empty array to prevent rendering issues
      }

    } catch (err) {
      // Catch and set any errors during the fetch operation
      console.error("useExpenseData: Error fetching grouped expenses:", err);
      setError(err); // Set the error state
      setGroupedExpenses([]); // Clear expenses on error
    } finally {
      setLoading(false); // Set loading to false after fetch attempt
      console.log('useExpenseData: Data loading process complete.');
    }
  }, [currentYear]); // Dependency array: re-run this effect if currentYear changes

  // useEffect to trigger data fetching when the component mounts or loadGroupedExpenseData changes
  useEffect(() => {
    console.log('useExpenseData: useEffect triggered for initial data loading or year change.');
    loadGroupedExpenseData();
  }, [loadGroupedExpenseData]); // loadGroupedExpenseData is a dependency, but it's memoized by useCallback

  // Log the current state being returned by the hook
  console.log('useExpenseData: Hook returning. Loading:', loading, 'Error:', error, 'Grouped Expenses count:', groupedExpenses.length);

  return {
    groupedExpenses, // The grouped expense data for the list
    currentYear,     // The currently selected year
    setCurrentYear,  // Function to update the selected year
    loading,         // Loading state
    error,           // Error state
    refetchExpenses: loadGroupedExpenseData, // Function to manually refetch data (e.g., after adding a new expense)
  };
};

export default useExpenseData;
