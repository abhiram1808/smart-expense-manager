// client/src/components/common/ActionModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Reusable modal component for confirmations or forms.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.show - Controls modal visibility.
 * @param {string} props.type - 'delete', 'confirm', or 'form'.
 * @param {string} props.title - Modal title.
 * @param {string} [props.message] - Message to display for 'delete' or 'confirm' types.
 * @param {Function} props.onConfirm - Callback when confirm button is clicked (for 'delete'/'confirm').
 * @param {Function} props.onClose - Callback when modal is closed or cancel button is clicked.
 * @param {string} props.confirmButtonText - Text for the confirm button.
 * @param {string} props.confirmButtonClass - CSS class for the confirm button.
 * @param {string} props.cancelButtonClass - CSS class for the cancel button.
 * @param {boolean} [props.isConfirmDisabled=false] - Whether the confirm button is disabled.
 * @param {React.ReactNode} [props.children] - Content to render inside the modal body for 'form' type.
 * @param {string} [props.formId] - REQUIRED if type="form". The ID of the form element within children.
 */
const ActionModal = ({
  show,
  type,
  title,
  message,
  onConfirm,
  onClose,
  confirmButtonText,
  confirmButtonClass,
  cancelButtonClass,
  isConfirmDisabled = false,
  children,
  formId,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type === 'form' ? (
          children
        ) : (
          <p>{message}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className={cancelButtonClass} onClick={onClose}>
          Cancel
        </Button>
        {type === 'form' ? (
          <Button
            variant="primary"
            className={confirmButtonClass}
            type="submit"
            form={formId}
            disabled={isConfirmDisabled}
          >
            {confirmButtonText}
          </Button>
        ) : (
          <Button
            variant="primary"
            className={confirmButtonClass}
            onClick={onConfirm}
            disabled={isConfirmDisabled}
          >
            {confirmButtonText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ActionModal;
