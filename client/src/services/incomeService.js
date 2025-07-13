// src/services/incomeService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/income'; // Base URL for your income API

/**
 * Creates a new income record.
 * @param {object} incomeData - { source: string, amount: number, date: string (YYYY-MM-DD) }
 */
export const createIncome = (incomeData) => {
  console.log("incomeService: Sending create income request:", incomeData);
  return axios.post(API_URL, incomeData);
};

/**
 * Fetches all income records, optionally with filters.
 * @param {object} filters - Optional filters like { month, source, minAmount, maxAmount, year }.
 */
export const fetchIncomes = (filters = {}) => { // Renamed to fetchIncomes (plural) for clarity
  console.log("incomeService: Fetching all incomes with filters:", filters);
  return axios.get(API_URL, { params: filters });
};

/**
 * Updates an existing income record.
 * @param {string} id - The ID of the income to update.
 * @param {object} incomeData - { source: string, amount: number, date: string (YYYY-MM-DD) }
 */
export const updateIncome = (id, incomeData) => {
  console.log(`incomeService: Sending update income request for ID ${id}:`, incomeData);
  return axios.put(`${API_URL}/${id}`, incomeData);
};

/**
 * Deletes an income record.
 * @param {string} id - The ID of the income to delete.
 */
export const deleteIncome = (id) => {
  console.log(`incomeService: Sending delete income request for ID ${id}.`);
  return axios.delete(`${API_URL}/${id}`);
};

/**
 * Fetches incomes grouped by month and year.
 * @param {number} year - The year to fetch data for.
 */
export const fetchIncomeGroupedByMonth = (year) => {
  console.log(`incomeService: Fetching grouped incomes for year ${year}`);
  return axios.get(`${API_URL}/grouped-by-month?year=${year}`);
};

/**
 * Fetches monthly income summary for a given year (for charts).
 * @param {number} year - The year to fetch summary for.
 */
export const fetchMonthlyIncomeSummary = (year) => {
  console.log(`incomeService: Fetching monthly income summary for year ${year}.`);
  return axios.get(`${API_URL}/summary/monthly?year=${year}`);
};

/**
 * Fetches income summary by source for a given year (for charts).
 * @param {number} year - The year to fetch summary for.
 */
export const fetchIncomeSummaryBySource = (year) => {
  console.log(`incomeService: Fetching income summary by source for year ${year}`);
  return axios.get(`${API_URL}/summary/source?year=${year}`);
};

/**
 * NEW: Fetches income by source, month by month, for a given year.
 * @param {number} year - The year to fetch data for.
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>} A promise that resolves with the data.
 */
export const fetchIncomeBySourceMonthly = (year) => {
  console.log(`incomeService: Fetching income by source monthly for year ${year}`);
  return axios.get(`${API_URL}/summary/source-monthly?year=${year}`);
};

// You can add other specific query service functions here if your frontend uses them
export const fetchIncomeByDateRange = (start, end) => {
  console.log(`incomeService: Fetching income by date range from ${start} to ${end}.`);
  return axios.get(`${API_URL}/daterange`, { params: { start, end } });
};

export const fetchIncomeBySourceAndMonth = (source, month) => {
  console.log(`incomeService: Fetching income by source ${source} and month ${month}.`);
  return axios.get(`${API_URL}/source-month`, { params: { source, month } });
};

export const fetchIncomeByAmountRangeAndMonth = (min, max, month) => {
  console.log(`incomeService: Fetching income by amount range ${min}-${max} for month ${month}.`);
  return axios.get(`${API_URL}/amount-month`, { params: { min, max, month } });
};

export const fetchIncomeSummaryByCategory = (year, month) => {
  console.log(`incomeService: Fetching income summary by category for year ${year} and month ${month}.`);
  return axios.get(`${API_URL}/summary/category`, { params: { year, month } });
}