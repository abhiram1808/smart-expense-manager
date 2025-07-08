// src/services/expenseService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses'; // Base URL for your expenses API

/**
 * Creates a new expense record.
 * @param {object} expenseData - { category: string, amount: number, date: string, description?: string }
 * @returns {Promise<axios.AxiosResponse>} A promise that resolves with the API response.
 */
export const createExpense = (expenseData) => {
  console.log("expenseService: Sending create expense request:", expenseData);
  return axios.post(API_URL, expenseData);
};

/**
 * Fetches all expense records, with optional filters and sorting.
 * @param {object} filters - Optional filters like { category, month, year, startDate, endDate, sortBy, sortOrder }.
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>} A promise that resolves with the expense data.
 */
export const fetchExpenses = (filters = {}) => {
  console.log("expenseService: Fetching expenses with filters:", filters);
  // --- CRITICAL FIX: Add a unique timestamp to bypass browser cache ---
  const paramsWithTimestamp = { ...filters, _t: Date.now() };
  // ------------------------------------------------------------------
  return axios.get(API_URL, { params: paramsWithTimestamp });
};

/**
 * Fetches a single expense record by ID.
 * @param {string} id - The ID of the expense to fetch.
 * @returns {Promise<axios.AxiosResponse<Object>>} A promise that resolves with the expense data.
 */
export const fetchExpenseById = (id) => {
  console.log(`expenseService: Fetching expense with ID: ${id}`);
  // Add timestamp for single fetches too
  return axios.get(`${API_URL}/${id}`, { params: { _t: Date.now() } });
};

/**
 * Updates an existing expense record.
 * @param {string} id - The ID of the expense to update.
 * @param {object} expenseData - The updated expense data. { category?, amount?, date?, description? }
 * @returns {Promise<axios.AxiosResponse>} A promise that resolves with the API response.
 */
export const updateExpense = (id, expenseData) => {
  console.log(`expenseService: Sending update expense request for ID ${id}:`, expenseData);
  return axios.put(`${API_URL}/${id}`, expenseData);
};

/**
 * Deletes an expense record.
 * @param {string} id - The ID of the expense to delete.
 * @returns {Promise<axios.AxiosResponse>} A promise that resolves with the API response.
 */
export const deleteExpense = (id) => {
  console.log(`expenseService: Sending delete expense request for ID ${id}.`);
  return axios.delete(`${API_URL}/${id}`);
};

// --- Analytics-related service calls for expenses ---

/**
 * Fetches expense summary by category for a given period.
 * @param {object} params - { month?, year?, startDate?, endDate? }
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>}
 */
export const fetchExpenseSummaryByCategory = (params = {}) => {
  console.log('expenseService: Fetching expense summary by category with params:', params);
  return axios.get(`${API_URL}/summary/category`, { params: { ...params, _t: Date.now() } });
};

/**
 * Fetches total expenses per month for a given year.
 * @param {number} year - The year to fetch data for.
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>}
 */
export const fetchMonthlyExpenseSummary = (year) => {
  console.log(`expenseService: Fetching monthly expense summary for year: ${year}`);
  return axios.get(`${API_URL}/summary/monthly`, { params: { year, _t: Date.now() } });
};

/**
 * Fetches total expenses per year.
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>}
 */
export const fetchYearlyExpenseSummary = () => {
  console.log('expenseService: Fetching yearly expense summary.');
  return axios.get(`${API_URL}/summary/yearly`, { params: { _t: Date.now() } });
};
