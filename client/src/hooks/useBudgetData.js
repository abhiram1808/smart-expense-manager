// src/hooks/useBudget.js
import { useState, useEffect, useCallback } from 'react';
import {
  fetchBudgetGroupedByMonth, // <--- Use this for the main list display
  createBudget,
  updateBudget,
  deleteBudget,
} from '../services/budgetService';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing budget data.
 * Handles data fetching, loading, error states, year/month selection, and CRUD operations.
 */
const useBudget = () => {
  const [groupedBudgets, setGroupedBudgets] = useState([]); // <--- Renamed to groupedBudgets
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-indexed (for Add form default)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Main filter for grouped list
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch grouped budget data from the backend based on currentYear
  const loadGroupedBudgets = useCallback(async () => { // <--- Renamed loadBudgets to loadGroupedBudgets
    setIsLoading(true);
    setError(null);
    try {
      console.log(`useBudget: Attempting to fetch grouped budgets for Year: ${currentYear}...`);
      const res = await fetchBudgetGroupedByMonth(currentYear); // <--- Call the new grouped fetch
      console.log('useBudget: Raw API Response for grouped budgets:', res.data);

      if (Array.isArray(res.data)) {
        setGroupedBudgets(res.data);
        console.log('useBudget: groupedBudgets state updated with', res.data.length, 'groups.');
      } else {
        console.error('useBudget: API response for grouped budgets is not an array:', res.data);
        setError(new Error('Received unexpected data format from backend for grouped budgets.'));
        setGroupedBudgets([]);
      }
    } catch (err) {
      console.error("useBudget: Error fetching grouped budgets:", err);
      setError(err);
      setGroupedBudgets([]);
    } finally {
      setIsLoading(false);
      console.log('useBudget: Budget data loading process complete.');
    }
  }, [currentYear]); // Now only depends on currentYear

  // Initial data load effect
  useEffect(() => {
    loadGroupedBudgets();
  }, [loadGroupedBudgets]);

  // --- CRUD Operations ---

  const addBudget = useCallback(async (budgetData) => {
    setIsAdding(true);
    try {
      const res = await createBudget(budgetData);
      toast.success('Budget added successfully! 💰');
      // Trigger a full refetch in background to ensure consistency
      loadGroupedBudgets(); // <--- Call loadGroupedBudgets after CRUD
      return res.data;
    } catch (err) {
      console.error('❌ Error adding budget:', err);
      toast.error(`Failed to add budget: ${err.response?.data?.error || err.message}`);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, [loadGroupedBudgets]);

  const updateBudgetItem = useCallback(async (id, budgetData) => {
    setIsUpdating(true);
    try {
      const res = await updateBudget(id, budgetData);
      toast.success('Budget updated successfully! ✨');
      // For optimistic update, you'd need to find the specific item within the grouped structure
      // For simplicity and consistency, we'll just refetch the whole grouped list.
      loadGroupedBudgets(); // <--- Call loadGroupedBudgets after CRUD
      return res.data;
    } catch (err) {
      console.error('❌ Error updating budget:', err);
      toast.error(`Failed to update budget: ${err.response?.data?.error || err.message}`);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [loadGroupedBudgets]);

  const deleteBudgetItem = useCallback(async (id) => {
    setIsDeleting(true);
    console.log(`useBudget: Attempting to delete budget with ID: ${id}`);
    try {
      await deleteBudget(id);
      toast.success('Budget deleted successfully! 🗑️');
      // For optimistic update, you'd need to remove the specific item from the grouped structure
      // For simplicity and consistency, we'll just refetch the whole grouped list.
      loadGroupedBudgets(); // <--- Call loadGroupedBudgets after CRUD
    } catch (err) {
      console.error('❌ Error deleting budget:', err);
      toast.error(`Failed to delete budget: ${err.response?.data?.error || err.message}`);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [loadGroupedBudgets]);

  return {
    groupedBudgets, // <--- Return groupedBudgets
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    error,
    addBudget,
    updateBudgetItem,
    deleteBudgetItem,
    refetchBudgets: loadGroupedBudgets, // Alias for manual refetch
  };
};

export default useBudget;
