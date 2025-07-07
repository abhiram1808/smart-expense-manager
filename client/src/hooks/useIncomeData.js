// src/hooks/useIncomeData.js
import { useEffect, useState, useCallback } from 'react';
import {
  fetchIncomeGroupedByMonth,
  createIncome,
  updateIncome,
  deleteIncome,
  fetchMonthlyIncomeSummary, // Ensure this is imported for the summary
} from '../services/incomeService';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing income data, specifically for the grouped-by-month view.
 * Handles data fetching, loading, error states, year selection, and CRUD operations.
 */
const useIncomeData = () => {
  const [groupedIncomes, setGroupedIncomes] = useState([]);
  const [monthlyIncomeSummary, setMonthlyIncomeSummary] = useState([]); // State for monthly summary
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = useState(true); // For initial/full data load
  const [isAdding, setIsAdding] = useState(false);   // For add operation
  const [isUpdating, setIsUpdating] = useState(false); // For update operation
  const [isDeleting, setIsDeleting] = useState(false); // For delete operation
  const [error, setError] = useState(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null); // For highlighting new entries

  // Fetch all necessary income data (grouped list and summary)
  const loadData = useCallback(async () => {
    setError(null); // Clear errors on new load attempt
    try {
      console.log(`useIncomeData: Attempting to fetch grouped incomes for year: ${currentYear}...`);
      const groupedRes = await fetchIncomeGroupedByMonth(parseInt(currentYear));
      console.log('useIncomeData: Raw API Response for grouped incomes:', groupedRes.data);

      if (Array.isArray(groupedRes.data)) {
        setGroupedIncomes(groupedRes.data);
        console.log('useIncomeData: groupedIncomes state updated with', groupedRes.data.length, 'groups.');
      } else {
        console.error('useIncomeData: API response for grouped incomes is not an array:', groupedRes.data);
        setError(new Error('Received unexpected data format from backend for grouped incomes.'));
        setGroupedIncomes([]);
      }

      // Fetch monthly income summary for analytics
      console.log(`useIncomeData: Attempting to fetch monthly income summary for year: ${currentYear}...`);
      const summaryRes = await fetchMonthlyIncomeSummary(parseInt(currentYear));
      console.log('useIncomeData: Raw API Response for monthly summary:', summaryRes.data);

      if (Array.isArray(summaryRes.data)) {
        setMonthlyIncomeSummary(summaryRes.data);
        console.log('useIncomeData: monthlyIncomeSummary state updated with', summaryRes.data.length, 'months.');
      } else {
        console.error('useIncomeData: API response for monthly summary is not an array:', summaryRes.data);
        // Don't set a global error if only summary fails, but log it.
        setMonthlyIncomeSummary([]);
      }

    } catch (err) {
      console.error("useIncomeData: Error fetching data:", err);
      setError(err);
      setGroupedIncomes([]);
      setMonthlyIncomeSummary([]);
    }
  }, [currentYear]);

  // Initial data load effect
  useEffect(() => {
    console.log('useIncomeData: useEffect triggered for initial data loading or year change.');
    const fetchDataAndSetLoading = async () => {
      setIsLoading(true); // Set global loading for initial fetch
      await loadData();
      setIsLoading(false); // Clear global loading after initial fetch
    };
    fetchDataAndSetLoading();
  }, [loadData]); // `loadData` is a dependency, but it's memoized by useCallback

  // --- CRUD Operations ---

  const addIncome = useCallback(async (incomeData) => {
    setIsAdding(true); // Set adding state
    try {
      const res = await createIncome(incomeData);
      toast.success('Income added successfully! 🎉');
      setRecentlyAddedId(res.data._id); // Set ID for highlighting

      // Optimistically add the new item to the current groupedIncomes state
      // This is a simplified optimistic update. A more robust one would
      // re-group the existing data + new data, or insert into the correct group.
      // For now, we'll just trigger a background refetch.
      loadData(); // Trigger background refetch for consistency and summary update

      setTimeout(() => setRecentlyAddedId(null), 2000); // Clear highlight after 2 seconds
      return res.data; // Return the new income object
    } catch (err) {
      console.error('❌ Error adding income:', err);
      toast.error(`Failed to add income: ${err.response?.data?.error || err.message}`);
      throw err;
    } finally {
      setIsAdding(false); // Clear adding state
    }
  }, [loadData]);

  const updateIncomeItem = useCallback(async (incomeData) => {
    setIsUpdating(true); // Set updating state
    try {
      const res = await updateIncome(incomeData._id, incomeData);
      toast.success('Income updated successfully! ✨');

      // Optimistically update the item in the current groupedIncomes state
      // This requires finding the correct group and item.
      setGroupedIncomes(prevGroups => {
        return prevGroups.map(group => {
          const updatedItems = group.items.map(item =>
            item._id === res.data._id ? res.data : item
          );
          // Recalculate group total if item amount changed
          const newTotal = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
          return { ...group, items: updatedItems, total: newTotal };
        });
      });
      loadData(); // Trigger background refetch for full consistency and summary update

      return res.data;
    } catch (err) {
      console.error('❌ Error updating income:', err);
      toast.error(`Failed to update income: ${err.response?.data?.error || err.message}`);
      throw err;
    } finally {
      setIsUpdating(false); // Clear updating state
    }
  }, [loadData]);

  const deleteIncomeItem = useCallback(async (id) => {
    setIsDeleting(true); // Set deleting state
    console.log(`useIncomeData: Attempting to delete income with ID: ${id}`);
    try {
      await deleteIncome(id);
      toast.success('Income deleted successfully! 🗑️');

      // Optimistically remove the item from the current groupedIncomes state
      setGroupedIncomes(prevGroups => {
        return prevGroups.map(group => {
          const filteredItems = group.items.filter(item => item._id !== id);
          // Recalculate group total after removal
          const newTotal = filteredItems.reduce((sum, item) => sum + (item.amount || 0), 0);
          return { ...group, items: filteredItems, total: newTotal };
        }).filter(group => group.items.length > 0); // Remove empty groups
      });
      loadData(); // Trigger background refetch for full consistency and summary update

    } catch (err) {
      console.error('❌ Error deleting income:', err);
      toast.error(`Failed to delete income: ${err.response?.data?.error || err.message}`);
      throw err;
    } finally {
      setIsDeleting(false); // Clear deleting state
    }
  }, [loadData]);


  console.log('useIncomeData: Hook returning. isLoading:', isLoading, 'isAdding:', isAdding, 'isUpdating:', isUpdating, 'isDeleting:', isDeleting, 'Error:', error, 'Grouped Incomes count:', groupedIncomes.length);

  return {
    groupedIncomes,
    monthlyIncomeSummary, // Expose monthly summary
    currentYear,
    setCurrentYear,
    isLoading, // Global loading for initial/full fetches
    isAdding,   // Specific loading for add
    isUpdating, // Specific loading for update
    isDeleting, // Specific loading for delete
    error,
    recentlyAddedId,
    addIncome,
    updateIncomeItem,
    deleteIncomeItem,
    refetchIncomes: loadData, // Alias for manual refetch
  };
};

export default useIncomeData;
