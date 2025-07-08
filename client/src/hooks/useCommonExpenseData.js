// src/hooks/useCommonExpenses.js
import { useState, useEffect, useCallback } from 'react';
import {
  createCommonExpense,
  fetchCommonExpenses,
  updateCommonExpense,
  deleteCommonExpense,
  fetchCommonExpenseSummaryByCategory,
  fetchCommonExpenseSummaryByDayOfMonth,
  fetchTotalActiveCommonExpensesAmount
} from '../services/commonExpenseService';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing common expense data.
 * Handles data fetching, loading, error states, and CRUD operations.
 */
const useCommonExpenses = () => {
  const [commonExpenses, setCommonExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // State for filters and sort
  const [filters, setFilters] = useState({}); // <--- This setter is returned
  const [sortBy, setSortBy] = useState('dayOfMonth'); // <--- This setter is returned

  // Fetch all common expenses
  const loadCommonExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('useCommonExpenses: Attempting to fetch common expenses...');
      const res = await fetchCommonExpenses(filters); // Use state filters
      let fetchedData = res.data;

      // Apply client-side sorting
      fetchedData.sort((a, b) => {
        if (sortBy === 'dayOfMonth') {
          return a.dayOfMonth - b.dayOfMonth;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'amount') {
          return a.amount - b.amount;
        }
        if (sortBy === 'startDate') {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateA.getTime() - dateB.getTime();
        }
        // Add more sorting logic here if needed
        return 0;
      });

      setCommonExpenses(fetchedData);
      console.log('useCommonExpenses: Common expenses loaded and sorted:', fetchedData.length);
    } catch (err) {
      console.error("useCommonExpenses: Error fetching common expenses:", err);
      setError(err);
      setCommonExpenses([]);
      toast.error(`Failed to load common expenses: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy]); // Depend on filters and sortBy states

  // Initial data load effect and re-load on filter/sort change
  useEffect(() => {
    loadCommonExpenses();
  }, [loadCommonExpenses]);

  // --- CRUD Operations ---

  const addCommonExpense = useCallback(async (commonExpenseData) => {
    setIsAdding(true);
    try {
      const dataToSend = {
        ...commonExpenseData,
        startDate: commonExpenseData.startDate ? commonExpenseData.startDate.toISOString() : null,
        endDate: commonExpenseData.endDate ? commonExpenseData.endDate.toISOString() : null,
        termMonths: commonExpenseData.termMonths !== '' ? Number(commonExpenseData.termMonths) : null,
      };
      const res = await createCommonExpense(dataToSend);
      toast.success('Common expense added successfully! 🔄');
      loadCommonExpenses(); // Refetch to update the list with new item and current filters/sort
      return res.data;
    } catch (err) {
      console.error('❌ Error adding common expense:', err);
      toast.error(`Failed to add common expense: ${err.response?.data?.error || err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, [loadCommonExpenses]);

  const updateCommonExpenseItem = useCallback(async (id, commonExpenseData) => {
    setIsUpdating(true);
    try {
      const dataToSend = {
        ...commonExpenseData,
        startDate: commonExpenseData.startDate ? commonExpenseData.startDate.toISOString() : null,
        endDate: commonExpenseData.endDate ? commonExpenseData.endDate.toISOString() : null,
        termMonths: commonExpenseData.termMonths !== '' ? Number(commonExpenseData.termMonths) : null,
      };
      const res = await updateCommonExpense(id, dataToSend);
      toast.success('Common expense updated successfully! ✨');
      loadCommonExpenses(); // Refetch to update the list
      return res.data;
    } catch (err) {
      console.error('❌ Error updating common expense:', err);
      toast.error(`Failed to update common expense: ${err.response?.data?.error || err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [loadCommonExpenses]);

  const deleteCommonExpenseItem = useCallback(async (id) => {
    setIsDeleting(true);
    console.log(`useCommonExpenses: Attempting to delete common expense with ID: ${id}`);
    try {
      await deleteCommonExpense(id);
      toast.success('Common expense deleted successfully! 🗑️');
      loadCommonExpenses(); // Refetch to update the list
    } catch (err) {
      console.error('❌ Error deleting common expense:', err);
      toast.error(`Failed to delete common expense: ${err.response?.data?.error || err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [loadCommonExpenses]);

  const fetchCommonExpenseAnalytics = useCallback(async () => {
    try {
      const [summaryByCategory, summaryByDay, totalActive] = await Promise.all([
        fetchCommonExpenseSummaryByCategory(),
        fetchCommonExpenseSummaryByDayOfMonth(),
        fetchTotalActiveCommonExpensesAmount()
      ]);
      return {
        summaryByCategory: summaryByCategory.data,
        summaryByDay: summaryByDay.data,
        totalActive: totalActive.data.totalAmount
      };
    } catch (err) {
      console.error('❌ Error fetching common expense analytics:', err);
      toast.error('Failed to load common expense analytics.');
      throw err;
    }
  }, []);


  return {
    commonExpenses,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    error,
    addCommonExpense,
    updateCommonExpenseItem,
    deleteCommonExpenseItem,
    refetchCommonExpenses: loadCommonExpenses,
    fetchCommonExpenseAnalytics,
    setFilters, // <--- EXPLICITLY RETURNED
    setSortBy,  // <--- EXPLICITLY RETURNED
  };
};

export default useCommonExpenses;
