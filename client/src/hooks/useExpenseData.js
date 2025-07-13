// client/src/hooks/useExpenseData.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { fetchExpenses } from '../services/expenseService';

/**
 * Custom hook for managing expense data.
 * Fetches expenses with optional filters, sorting, and pagination.
 *
 * @param {object} initialParams - Initial parameters for fetching expenses.
 * {
 * startDate?: string,
 * endDate?: string,
 * month?: number,
 * year?: number,
 * category?: string,
 * sortBy?: string,
 * sortOrder?: 'asc' | 'desc',
 * limit?: number, // Items per page
 * page?: number   // Current page number
 * }
 */
const useExpenses = (initialParams = {}) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams); // State to hold current parameters (filters, sort, pagination)

  // New states for pagination metadata
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);

  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchExpenses(params); // Pass all params to the service
      setExpenses(response.data.expenses); // Backend now returns { expenses, totalCount, totalPages, ... }
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      console.error('useExpenses: Error fetching expenses:', err.response?.data || err.message);
      setError(err);
      toast.error(`Failed to load expenses: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [params]); // Re-run effect when params change

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // Function to update parameters and trigger a re-fetch
  const updateParams = useCallback((newParams) => {
    setParams(prevParams => ({ ...prevParams, ...newParams }));
  }, []);

  return {
    expenses,
    isLoading,
    error,
    refetchExpenses: loadExpenses, // Allow manual re-fetching
    params,
    updateParams,   // <--- CRITICAL: ENSURE THIS IS RETURNED
    totalCount,
    totalPages,
    currentPage,
  };
};

export default useExpenses;
