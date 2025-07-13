// src/services/budgetService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/budget'; // Base URL for your budget API

/**
 * Creates a new budget record.
 * @param {object} budgetData - { category: string, amount: number, month: number, year: number }
 * @returns {Promise<axios.AxiosResponse>} A promise that resolves with the API response.
 */
export const createBudget = (budgetData) => {
  console.log("budgetService: Sending create budget request:", budgetData);
  return axios.post(API_URL, budgetData);
};

/**
 * Fetches all budget records, with optional filters.
 * @param {object} filters - Optional filters like { month, year, category }.
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>} A promise that resolves with the budget data.
 */
export const fetchBudgets = (filters = {}) => {
  console.log("budgetService: Fetching budgets with filters:", filters);
  return axios.get(API_URL, { params: filters });
};

/**
 * Fetches a single budget record by ID.
 * @param {string} id - The ID of the budget to fetch.
 * @returns {Promise<axios.AxiosResponse<Object>>} A promise that resolves with the budget data.
 */
export const fetchBudgetById = (id) => {
  console.log(`budgetService: Fetching budget with ID: ${id}`);
  return axios.get(`${API_URL}/${id}`);
};

/**
 * Updates an existing budget record.
 * @param {string} id - The ID of the budget to update.
 * @param {object} budgetData - The updated budget data. { category?, amount?, month?, year? }
 * @returns {Promise<axios.AxiosResponse>} A promise that resolves with the API response.
 */
export const updateBudget = (id, budgetData) => {
  console.log(`budgetService: Sending update budget request for ID ${id}:`, budgetData);
  return axios.put(`${API_URL}/${id}`, budgetData);
};

/**
 * Deletes a budget record.
 * @param {string} id - The ID of the budget to delete.
 * @returns {Promise<axios.AxiosResponse>} A promise that resolves with the API response.
 */
export const deleteBudget = (id) => {
  console.log(`budgetService: Sending delete budget request for ID ${id}.`);
  return axios.delete(`${API_URL}/${id}`);
};

/**
 * Fetches budgets grouped by month and year.
 * @param {number} year - The year to fetch data for.
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>} A promise that resolves with the grouped budget data.
 */
export const fetchBudgetGroupedByMonth = (year) => {
  console.log(`budgetService: Fetching grouped budgets for year ${year}`);
  return axios.get(`${API_URL}/grouped-by-month?year=${year}`);
};

/**
 * Fetches budget summary by category for a given year (for charts).
 * @param {number} year - The year to fetch summary for.
 */
export const fetchBudgetSummaryByCategory = (year) => { // This should be present
  console.log(`budgetService: Fetching budget summary by category for year ${year}`);
  return axios.get(`${API_URL}/summary/category?year=${year}`);
};

/**
 * Fetches monthly budget summary for a given year (for charts).
 * @param {number} year - The year to fetch summary for.
 */
export const fetchMonthlyBudgetSummary = (year) => { // This should be present
  console.log(`budgetService: Fetching monthly budget summary for year ${year}.`);
  return axios.get(`${API_URL}/summary/monthly?year=${year}`);
};

export const fetchIncomeSummaryByCategory = (year, month) => {
  console.log(`budgetService: Fetching income summary by category for year ${year}, month ${month}`);
  return axios.get(`${API_URL}/income/summary/category`, { params: { year, month } });
} 