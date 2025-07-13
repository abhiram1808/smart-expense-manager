// client/src/hooks/useCommonExpenseData.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  createCommonExpense,
  fetchCommonExpenses,
  updateCommonExpense, // This is the function being called
  deleteCommonExpense,
  triggerRecurringExpenseGeneration,
} from '../services/commonExpenseService';

/**
 * Custom hook for managing common expense items, which are now recurring expense templates.
 * Handles data fetching, loading, error states, and CRUD operations for CommonExpense model.
 */
const useCommonExpenseData = () => {
  const [commonExpenses, setCommonExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all common expenses (now recurring templates)
  const loadCommonExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchCommonExpenses();
      setCommonExpenses(response.data);
      console.log('useCommonExpenseData: Fetched common expenses (recurring templates):', response.data.length);
    } catch (err) {
      console.error('useCommonExpenseData: Error fetching common expenses:', err.response?.data || err.message);
      setError(err);
      toast.error(`Failed to load common expenses: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new common expense (now recurring template)
  const addCommonExpense = useCallback(async (expenseData) => {
    setIsAdding(true);
    setError(null);
    try {
      const response = await createCommonExpense(expenseData);
      setCommonExpenses((prev) => [...prev, response.data]);
      toast.success('Recurring expense template added successfully! 🔄');
      return response.data;
    } catch (err) {
      console.error('useCommonExpenseData: Error adding common expense:', err.response?.data || err.message);
      setError(err);
      toast.error(`Failed to add recurring expense template: ${err.response?.data?.error || err.message}`);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, []);

  // Update an existing common expense (now recurring template)
  const updateCommonExpense = useCallback(async (id, updatedData) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await updateCommonExpense(id, updatedData);
      console.log('DEBUG: updateCommonExpense response data:', response.data); // <--- NEW DEBUG LOG
      if (!response.data) {
          throw new Error("Update response data is empty or invalid.");
      }
      setCommonExpenses((prev) =>
        prev.map((expense) => (expense._id === id ? response.data : expense))
      );
      toast.success('Recurring expense template updated successfully! ✨');
      return response.data;
    } catch (err) {
      console.error('useCommonExpenseData: Error updating common expense:', err.response?.data || err.message);
      setError(err);
      toast.error(`Failed to update recurring expense template: ${err.response?.data?.error || err.message}`);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Delete a common expense (now recurring template)
  const deleteCommonExpense = useCallback(async (id) => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteCommonExpense(id);
      setCommonExpenses((prev) => prev.filter((expense) => expense._id !== id));
      toast.success('Recurring expense template deleted successfully! 🗑️');
    } catch (err) {
      console.error('useCommonExpenseData: Error deleting common expense:', err.response?.data || err.message);
      setError(err);
      toast.error(`Failed to delete recurring expense template: ${err.response?.data?.error || err.message}`);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Toggle active status of a template
  const toggleTemplateActiveStatus = useCallback(async (templateId, currentStatus) => {
    setIsUpdating(true);
    setError(null);
    try {
      // Call the update endpoint with the new isActive status
      // This calls the updateCommonExpense function defined above
      const response = await updateCommonExpense(templateId, { isActive: !currentStatus });
      // The setCommonExpenses logic is now handled by the updateCommonExpense callback itself
      toast.success(`Template ${response.isActive ? 'activated' : 'paused'} successfully!`); // Use response.isActive directly
      return response; // Return the updated template
    } catch (err) {
      console.error('useCommonExpenseData: Error toggling template status:', err);
      setError(err);
      toast.error(`Failed to toggle template status: ${err.response?.data?.error || err.message}`);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [updateCommonExpense]); // Add updateCommonExpense to dependencies

  // Trigger the backend automation for recurring expenses
  const triggerGeneration = useCallback(async () => {
    try {
      const response = await triggerRecurringExpenseGeneration();
      toast.info(response.data.message || 'Recurring expenses generation triggered.');
    } catch (err) {
      console.error('useCommonExpenseData: Error triggering generation:', err);
      toast.error(`Failed to trigger generation: ${err.response?.data?.error || err.message}`);
    }
  }, []);

  // Initial load of common expenses
  useEffect(() => {
    loadCommonExpenses();
  }, [loadCommonExpenses]);

  return {
    commonExpenses,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    error,
    addCommonExpense,
    updateCommonExpense,
    deleteCommonExpense,
    toggleTemplateActiveStatus,
    triggerGeneration,
    refetchCommonExpenses: loadCommonExpenses,
  };
};

export default useCommonExpenseData;
