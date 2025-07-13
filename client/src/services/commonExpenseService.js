// client/src/services/commonExpenseService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/common-expenses'; // Base URL for your common expenses API

/**
 * Creates a new common expense record (recurring template).
 * @param {object} commonExpenseData - { name: string, category: string, amount: number, dayOfMonth: number, startDate: string, endDate?: string, termMonths?: number, isActive?: boolean }
 * @returns {Promise<axios.AxiosResponse>} A promise that resolves with the API response.
 */
export const createCommonExpense = (commonExpenseData) => {
  console.log("commonExpenseService: Sending create common expense request:", commonExpenseData);
  return axios.post(API_URL, commonExpenseData);
};

/**
 * Fetches all common expense records (recurring templates), with optional filters.
 * @param {object} filters - Optional filters like { category, isActive }.
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>} A promise that resolves with the common expense data.
 */
export const fetchCommonExpenses = (filters = {}) => {
  console.log("commonExpenseService: Fetching common expenses with filters:", filters);
  return axios.get(API_URL, { params: filters });
};

/**
 * Fetches a single common expense record (recurring template) by ID.
 * @param {string} id - The ID of the common expense to fetch.
 * @returns {Promise<axios.AxiosResponse<Object>>} A promise that resolves with the common expense data.
 */
export const fetchCommonExpenseById = (id) => {
  console.log(`commonExpenseService: Fetching common expense with ID: ${id}`);
  return axios.get(`${API_URL}/${id}`);
};

/**
 * Updates an existing common expense record (recurring template).
 * @param {string} id - The ID of the common expense to update.
 * @param {object} commonExpenseData - The updated common expense data. { name?, category?, amount?, dayOfMonth?, startDate?, endDate?, termMonths?, isActive? }
 * @returns {Promise<axios.AxiosResponse>} A promise that resolves with the API response.
 */
export const updateCommonExpense = (id, commonExpenseData) => {
  console.log(`commonExpenseService: Sending update common expense request for ID ${id}:`, commonExpenseData);
  return axios.put(`${API_URL}/${id}`, commonExpenseData);
};

/**
 * Deletes a common expense record (recurring template).
 * @param {string} id - The ID of the common expense to delete.
 * @returns {Promise<axios.AxiosResponse>} A promise that resolves with the API response.
 */
export const deleteCommonExpense = (id) => {
  console.log(`commonExpenseService: Sending delete common expense request for ID ${id}.`);
  return axios.delete(`${API_URL}/${id}`);
};

/**
 * Triggers the manual generation of recurring expenses on the backend.
 * @returns {Promise<axios.AxiosResponse>} A promise that resolves with the API response.
 */
export const triggerRecurringExpenseGeneration = () => {
  console.log('commonExpenseService: Sending request to trigger recurring expense generation.');
  return axios.post(`${API_URL}/generate`);
};

// --- Analytics-related service calls for common expenses (THESE MUST BE EXPORTED) ---

/**
 * Fetches common expense summary by category.
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>}
 */
export const fetchCommonExpenseSummaryByCategory = () => { // <--- ENSURE THIS IS EXPORTED
  console.log('commonExpenseService: Fetching common expense summary by category.');
  return axios.get(`${API_URL}/summary/category`);
};

/**
 * Fetches common expense summary by day of month.
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>}
 */
export const fetchCommonExpenseSummaryByDayOfMonth = () => { // <--- ENSURE THIS IS EXPORTED
  console.log('commonExpenseService: Fetching common expense summary by day of month.');
  return axios.get(`${API_URL}/summary/day-of-month`);
};

/**
 * Fetches the total amount of all active common expenses.
 * @returns {Promise<axios.AxiosResponse<Object>>} Resolves with { totalAmount: number }.
 */
export const fetchTotalActiveCommonExpensesAmount = () => { // <--- ENSURE THIS IS EXPORTED
  console.log('commonExpenseService: Fetching total active common expenses amount.');
  return axios.get(`${API_URL}/total-active`);
};
