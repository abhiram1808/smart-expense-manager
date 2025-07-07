import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/common-expenses';

export default function useCommonExpenseData() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setExpenses(res.data);
    } catch (err) {
      setExpenses([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (expense) => {
    await axios.post(API, expense);
    fetchExpenses();
  };

  const updateExpense = async (expense) => {
    await axios.put(`${API}/${expense._id}`, expense);
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchExpenses();
  };

  const toggleExpense = async (id) => {
    await axios.patch(`${API}/${id}/toggle`);
    fetchExpenses();
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    toggleExpense,
    refetch: fetchExpenses,
  };
}
