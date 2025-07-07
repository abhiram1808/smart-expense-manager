// src/components/Shared/CategoryDropdown.jsx
import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../../services/categoryService'; // Adjust path as needed
import { toast } from 'react-toastify';

/**
 * Reusable dropdown component for selecting a category.
 * Fetches categories from the backend and handles its own loading/error states.
 *
 * @param {object} props - Component props.
 * @param {string} props.id - The HTML 'id' attribute for the select element.
 * @param {string} props.name - The HTML 'name' attribute for the select element.
 * @param {string} props.value - The currently selected category name.
 * @param {Function} props.onChange - Callback function when the selected value changes.
 * @param {boolean} [props.required=false] - Whether the select element is required.
 * @param {boolean} [props.disabled=false] - Whether the select element is disabled.
 * @param {string} [props.className='form-select'] - Additional CSS classes for the select.
 */
const CategoryDropdown = ({
  id,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  className = 'form-select'
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchCategories();
        setCategories(res.data);
      } catch (err) {
        console.error('❌ Error fetching categories:', err);
        setError(err);
        toast.error('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <select className={className} id={id} name={name} disabled>
        <option value="">Loading categories...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select className={`${className} is-invalid`} id={id} name={name} disabled>
        <option value="">Error loading categories</option>
      </select>
    );
  }

  return (
    <select
      className={className}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
    >
      <option value="">Select Category</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat.name}>
          {cat.name}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
