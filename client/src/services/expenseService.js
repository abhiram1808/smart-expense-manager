// src/services/expenseService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses'; // Base URL for your backend expense API

/**
 * Creates a new expense record in the backend.
 * @param {object} expenseData - The expense data to create (e.g., { category, amount, date, isRecurring })
 * @returns {Promise<axios.AxiosResponse>} A promise that resolves with the API response.
 */
export const createExpense = (expenseData) => {
  console.log("expenseService: Sending create expense request:", expenseData);
  return axios.post(API_URL, expenseData);
};

/**
 * Fetches expenses grouped by month and year from the backend.
 * This is the primary function for the grouped list view.
 * @param {number} year - The year for which to fetch grouped expenses.
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>} A promise that resolves with the grouped expense data.
 */
export const fetchGroupedExpensesByMonth = (year) => {
  console.log(`expenseService: Fetching grouped expenses for year ${year}`);
  return axios.get(`${API_URL}/grouped-by-month?year=${year}`);
};

// RE-ADDING: Service function to fetch all expenses (flat list)
// This is likely what AnalyticsPage.jsx is looking for.
export const fetchExpenses = () => {
  console.log("expenseService: Fetching all expenses (flat list).");
  return axios.get(API_URL); // Assumes backend has a GET /api/expenses endpoint
};

// RE-ADDING: Service function to fetch monthly expense summary
// This is also commonly used for analytics/summary dashboards.
export const fetchMonthlyExpenseSummary = (year) => {
  console.log(`expenseService: Fetching monthly expense summary for year ${year}.`);
  return axios.get(`${API_URL}/summary/monthly?year=${year}`); // Assumes backend has a GET /api/expenses/summary/monthly endpoint
};

// Add update and delete functions if your application needs them elsewhere
// export const updateExpense = (id, expenseData) => axios.put(`${API_URL}/${id}`, expenseData);
// export const deleteExpense = (id) => axios.delete(`${API_URL}/${id}`);
