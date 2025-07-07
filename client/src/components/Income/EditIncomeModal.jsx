// src/components/Income/EditIncomeModal.jsx
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditIncomeModal = ({ income, onClose, onSave }) => {
  const [form, setForm] = useState({
    ...income,
    month: income.month?.slice(0, 7), // yyyy-mm
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form });
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Income</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Source</Form.Label>
            <Form.Control
              type="text"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Month</Form.Label>
            <Form.Control
              type="month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditIncomeModal;
