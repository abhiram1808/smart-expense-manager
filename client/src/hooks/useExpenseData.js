// src/hooks/useExpenses.js (snippet of addExpense)
import { useState, useEffect, useCallback } from 'react';
import {
  createExpense,
  fetchExpenses,
  updateExpense,
  deleteExpense,
  fetchExpenseSummaryByCategory,
  fetchMonthlyExpenseSummary,
  fetchYearlyExpenseSummary
} from '../services/expenseService';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing expense data.
 * Handles data fetching, loading, error states, and CRUD operations,
 * including dynamic filtering and sorting.
 */
const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // State for filters and sort
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('date'); // Default sort by date
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort order descending

  // Fetch all expenses based on current filters and sort
  // This useCallback will re-create itself ONLY when filters, sortBy, or sortOrder change.
  const loadExpenses = useCallback(async () => {
    console.log('useExpenses: [START] loadExpenses called. Setting isLoading to true.');
    setIsLoading(true);
    setError(null);
    try {
      console.log('useExpenses: Attempting to fetch expenses with filters:', filters, 'and sort:', sortBy, sortOrder);
      const res = await fetchExpenses({ ...filters, sortBy, sortOrder });

      console.log('useExpenses: [API Response] Raw res.data received:', res.data);
      if (Array.isArray(res.data)) {
        console.log('useExpenses: [API Response] Data is an array. Length:', res.data.length);
      } else {
        console.log('useExpenses: [API Response] Data is NOT an array. Type:', typeof res.data, 'Value:', res.data);
      }

      setExpenses(res.data); // Update expenses state
      console.log('useExpenses: [State Update] setExpenses called with data of length:', res.data.length);

    } catch (err) {
      console.error("useExpenses: [ERROR] Error fetching expenses:", err);
      setError(err);
      setExpenses([]); // Clear expenses on error
      toast.error(`Failed to load expenses: ${err.response?.data?.error || err.message}`);
    } finally {
      console.log('useExpenses: [END] Fetch operation finished. Setting isLoading to false.');
      setIsLoading(false);
    }
  }, [filters, sortBy, sortOrder]); // Dependencies for useCallback

  // This useEffect will run ONLY when loadExpenses changes (which is when filters/sort change)
  useEffect(() => {
    console.log('useExpenses: [useEffect] Triggering loadExpenses on mount or dependency change.');
    loadExpenses();
  }, [loadExpenses]); // Dependency for useEffect

  // --- CRUD Operations (no changes, they correctly trigger loadExpenses) ---

 const addExpense = useCallback(async (expenseData) => {
    setIsAdding(true);
    try {
      // This line is correct: it takes the date string (e.g., "2023-10-26")
      // creates a Date object from it, and then converts it to ISO string for MongoDB.
      const dataToSend = {
        ...expenseData,
        date: expenseData.date ? new Date(expenseData.date).toISOString() : null,
      };
      console.log('useExpenses: addExpense - Data being sent to backend:', dataToSend); // Add this log
      const res = await createExpense(dataToSend);
      toast.success('Expense added successfully! 💸');
      console.log('useExpenses: addExpense successful. Refetching data.');
      loadExpenses(); // Refetch to update the list
      return res.data;
    } catch (err) {
      console.error('❌ Error adding expense:', err);
      // Log the full error response from backend if available
      if (err.response && err.response.data) {
        console.error('Backend Error Response:', err.response.data);
      }
      toast.error(`Failed to add expense: ${err.response?.data?.error || err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, [loadExpenses]);

  const updateExpenseItem = useCallback(async (id, expenseData) => {
    setIsUpdating(true);
    try {
      const dataToSend = {
        ...expenseData,
        date: expenseData.date ? new Date(expenseData.date).toISOString() : null,
      };
      const res = await updateExpense(id, dataToSend);
      toast.success('Expense updated successfully! ✨');
      console.log('useExpenses: updateExpense successful. Refetching data.');
      loadExpenses();
      return res.data;
    } catch (err) {
      console.error('❌ Error updating expense:', err);
      toast.error(`Failed to update expense: ${err.response?.data?.error || err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [loadExpenses]);

  const deleteExpenseItem = useCallback(async (id) => {
    setIsDeleting(true);
    console.log(`useExpenses: Attempting to delete expense with ID: ${id}`);
    try {
      await deleteExpense(id);
      toast.success('Expense deleted successfully! 🗑️');
      console.log('useExpenses: deleteExpense successful. Refetching data.');
      loadExpenses();
    } catch (err) {
      console.error('❌ Error deleting expense:', err);
      toast.error(`Failed to delete expense: ${err.response?.data?.error || err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [loadExpenses]);

  const getExpenseAnalytics = useCallback(async (params = {}) => {
    try {
      const [byCategory, monthlySummary, yearlySummary] = await Promise.all([
        fetchExpenseSummaryByCategory(params),
        params.year ? fetchMonthlyExpenseSummary(params.year) : Promise.resolve({ data: [] }),
        fetchYearlyExpenseSummary()
      ]);
      return {
        byCategory: byCategory.data,
        monthlySummary: monthlySummary.data,
        yearlySummary: yearlySummary.data
      };
    } catch (err) {
      console.error('❌ Error fetching expense analytics:', err);
      toast.error('Failed to load expense analytics.');
      throw err;
    }
  }, []);

  return {
    expenses,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    error,
    addExpense,
    updateExpenseItem,
    deleteExpenseItem,
    refetchExpenses: loadExpenses,
    setFilters,
    setSortBy,
    setSortOrder,
    getExpenseAnalytics,
  };
};

export default useExpenses;
