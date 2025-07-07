// src/components/Budget/EditBudgetModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditBudgetModal = ({ budget, onClose, onSave }) => {
  const [form, setForm] = useState({
    ...budget,
    month: budget.month?.slice(0, 7), // Truncate to YYYY-MM
  });

// Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form });
  };


  return (
    <Modal show onHide={onClose} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Budget</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Category Input */}
          <Form.Group className="mb-3" controlId="editBudgetCategory">
            <Form.Label>Category</Form.Label>
            {/*
              Option 1: Simple text input for category (like your income modal)
              If you want to use your CategoryDropdown here, uncomment Option 2.
            */}
            <Form.Control
              type="text"
              name="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
            {/*
              Option 2: Using a CategoryDropdown component
              If you use this, ensure CategoryDropdown is imported and handles its value/onChange correctly.
              <CategoryDropdown
                value={form.category}
                onChange={(e) => handleChange({ target: { name: 'category', value: e.target.value } })}
                // Pass type="budget" if your dropdown needs to filter categories
                // type="budget"
              />
            */}
          </Form.Group>

          {/* Budget Amount Input */}
          <Form.Group className="mb-3" controlId="editBudgetAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="budgetAmount"
              value={form.budgetAmount}
              onChange={(e) => setForm({ ...form, budgetAmount: parseFloat(e.target.value) })}
              required
            />
          </Form.Group>

          {/* Month Input */}
          <Form.Group controlId="editBudgetMonth">
            <Form.Label>Month</Form.Label>
            <Form.Control
              type="month"
              name="month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditBudgetModal;