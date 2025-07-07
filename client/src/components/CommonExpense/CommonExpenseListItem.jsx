import React, { useState } from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const CommonExpenseListItem = ({ expense, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    category: expense.category,
    amount: String(expense.amount),
    startDate: expense.startDate ? expense.startDate.slice(0, 10) : '',
    duration: expense.duration || '',
    isActive: expense.isActive,
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({
      category: expense.category,
      amount: String(expense.amount),
      startDate: expense.startDate ? expense.startDate.slice(0, 10) : '',
      duration: expense.duration || '',
      isActive: expense.isActive,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      category: expense.category,
      amount: String(expense.amount),
      startDate: expense.startDate ? expense.startDate.slice(0, 10) : '',
      duration: expense.duration || '',
      isActive: expense.isActive,
    });
  };

  const handleSaveClick = () => {
    const updated = {
      ...expense,
      category: editForm.category,
      amount: parseFloat(editForm.amount),
      startDate: editForm.startDate,
      duration: editForm.duration ? parseInt(editForm.duration) : undefined,
      isActive: editForm.isActive,
    };
    onUpdate(updated); // Triggers confirmation modal in parent
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDeleteClick = () => {
    onDelete(expense._id); // Triggers confirmation modal in parent
  };

  return (
    <tr>
      {isEditing ? (
        <>
          <td>
            <input
              className="form-control form-control-sm"
              name="category"
              value={editForm.category}
              onChange={handleChange}
            />
          </td>
          <td>
            <input
              className="form-control form-control-sm"
              type="number"
              name="amount"
              value={editForm.amount}
              onChange={handleChange}
            />
          </td>
          <td>
            <input
              className="form-control form-control-sm"
              type="date"
              name="startDate"
              value={editForm.startDate}
              onChange={handleChange}
            />
          </td>
          <td>
            <input
              className="form-control form-control-sm"
              type="number"
              name="duration"
              value={editForm.duration}
              onChange={handleChange}
            />
          </td>
          <td className="text-center">
            <input
              type="checkbox"
              name="isActive"
              checked={editForm.isActive}
              onChange={handleChange}
            />
          </td>
          <td className="text-center">
            <button className="btn btn-sm btn-success me-1" onClick={handleSaveClick} title="Save"><FaCheck /></button>
            <button className="btn btn-sm btn-secondary" onClick={handleCancelEdit} title="Cancel"><FaTimes /></button>
          </td>
        </>
      ) : (
        <>
          <td>{expense.category}</td>
          <td>{expense.amount}</td>
          <td>{expense.startDate?.slice(0, 10)}</td>
          <td>{expense.duration || '∞'}</td>
          <td className="text-center">
            <input
              type="checkbox"
              checked={expense.isActive}
              readOnly
            />
          </td>
          <td className="text-center">
            <button className="btn btn-sm btn-outline-primary me-1" onClick={handleEditClick} title="Edit"><FaEdit /></button>
            <button className="btn btn-sm btn-outline-danger" onClick={handleDeleteClick} title="Delete"><FaTrash /></button>
          </td>
        </>
      )}
    </tr>
  );
};

export default CommonExpenseListItem;
