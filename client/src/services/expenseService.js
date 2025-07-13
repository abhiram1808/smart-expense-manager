// client/src/services/expenseService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses';

export const createExpense = (expenseData) => {
  return axios.post(API_URL, expenseData);
};

export const fetchExpenses = (filters = {}) => {
  console.log("expenseService: Fetching expenses with filters:", filters);
  return axios.get(API_URL, { params: filters });
};

export const updateExpense = (id, expenseData) => {
  return axios.put(`${API_URL}/${id}`, expenseData);
};

export const deleteExpense = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// --- Analytics functions for Expenses ---
export const fetchExpenseSummaryByCategory = (year, month) => {
  return axios.get(`${API_URL}/summary/category`, { params: { year, month } });
};

export const fetchMonthlyExpenseSummary = (year) => {
  return axios.get(`${API_URL}/summary/monthly`, { params: { year } });
};

export const fetchYearlyExpenseSummary = () => {
  return axios.get(`${API_URL}/summary/yearly`);
};

// --- AI Insights function ---
export const fetchSpendingInsights = () => {
  console.log("expenseService: Fetching AI spending insights.");
  return axios.get(`${API_URL}/insights`);
};

export const fetchIncomeSummaryByCategory = (year, month) => {
  return axios.get(`${API_URL}/income/summary/category`, { params: { year, month } });
};