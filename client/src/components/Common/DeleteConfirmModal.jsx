// src/components/common/DeleteConfirmModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmModal = ({ show, onClose, onConfirm, title = "Delete Confirmation", message = "Are you sure you want to delete this item?" }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
