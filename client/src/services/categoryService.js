// src/services/categoryService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/categories'; // Assuming your backend categories API endpoint

/**
 * Fetches all categories from the backend.
 * @returns {Promise<axios.AxiosResponse<Array<Object>>>} A promise that resolves with the categories data.
 */
export const fetchCategories = () => {
  console.log("categoryService: Fetching all categories.");
  return axios.get(API_URL);
};

/**
 * Creates a new category.
 * @param {object} categoryData - { name: string }
 * @returns {Promise<axios.AxiosResponse>}
 */
export const createCategory = (categoryData) => {
  console.log("categoryService: Creating category:", categoryData);
  return axios.post(API_URL, categoryData);
};

/**
 * Deletes a category by ID.
 * @param {string} id - The ID of the category to delete.
 * @returns {Promise<axios.AxiosResponse>}
 */
export const deleteCategory = (id) => {
  console.log("categoryService: Deleting category with ID:", id);
  return axios.delete(`${API_URL}/${id}`);
};

/**
 * Updates a category by ID.
 * @param {string} id - The ID of the category to update.
 * @param {object} categoryData - { name: string }
 * @returns {Promise<axios.AxiosResponse>}
 */
export const updateCategory = (id, categoryData) => {
  console.log("categoryService: Updating category with ID:", id, categoryData);
  return axios.put(`${API_URL}/${id}`, categoryData);
};
