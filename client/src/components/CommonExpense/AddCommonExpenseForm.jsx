// client/src/components/CommonExpense/AddCommonExpenseForm.jsx
import React, { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

/**
 * Form component for adding a new common expense item.
 * @param {object} props - Component props.
 * @param {Function} props.onAdd - Callback to add a new common expense.
 * @param {boolean} props.isAdding - Loading state from parent.
 * @param {Array<string>} props.uniqueCategories - List of existing categories for dropdown.
 */
const AddCommonExpenseForm = ({ onAdd, isAdding, uniqueCategories }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !category) {
      toast.error('Please fill all fields.');
      return;
    }
    try {
      await onAdd({
        description,
        amount: parseFloat(amount),
        category,
      });
      setDescription('');
      setAmount('');
      setCategory('');
    } catch (error) {
      // Error handled by the hook/service
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            required
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100 d-flex align-items-center justify-content-center" disabled={isAdding}>
            <FaPlusCircle className="me-2" />
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddCommonExpenseForm;
