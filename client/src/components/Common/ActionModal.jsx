// src/components/common/ActionModal.jsx
import React from 'react';

/**
 * A reusable modal component for confirmations (e.g., delete, update).
 * Uses Bootstrap modal classes.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.show - Whether the modal should be visible.
 * @param {string} props.title - The title of the modal.
 * @param {string} props.message - The main message/question in the modal body.
 * @param {Function} props.onConfirm - Callback function when the confirm button is clicked.
 * @param {Function} props.onClose - Callback function when the modal is closed (cancel or backdrop click).
 * @param {string} [props.confirmButtonText='Confirm'] - Text for the confirm button.
 * @param {string} [props.cancelButtonText='Cancel'] - Text for the cancel button.
 * @param {string} [props.confirmButtonClass='btn-primary'] - CSS class for the confirm button.
 * @param {string} [props.cancelButtonClass='btn-secondary'] - CSS class for the cancel button.
 * @param {string} [props.type='info'] - Optional type for styling (e.g., 'delete', 'update', 'info').
 */
const ActionModal = ({
  show,
  title,
  message,
  onConfirm,
  onClose,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonClass = 'btn-primary',
  cancelButtonClass = 'btn-secondary',
  type = 'info', // 'delete', 'update', 'info'
}) => {
  if (!show) {
    return null;
  }

  // Determine header and confirm button color based on type
  let headerBgClass = 'bg-primary text-white';
  if (type === 'delete') {
    headerBgClass = 'bg-danger text-white';
    confirmButtonClass = 'btn-danger';
  } else if (type === 'update') {
    headerBgClass = 'bg-info text-white';
    confirmButtonClass = 'btn-info';
  } else if (type === 'success') {
    headerBgClass = 'bg-success text-white';
    confirmButtonClass = 'btn-success';
  }

  return (
    <div
      className="modal fade show d-block" // 'show' and 'd-block' make it visible
      tabIndex="-1"
      role="dialog"
      aria-labelledby="actionModalLabel"
      aria-hidden="true"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} // Backdrop overlay
      onClick={onClose} // Close on backdrop click
    >
      <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content" style={{ borderRadius: '12px' }}>
          <div className={`modal-header ${headerBgClass}`} style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <h5 className="modal-title" id="actionModalLabel">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <p className="lead text-center">{message}</p>
          </div>
          <div className="modal-footer d-flex justify-content-center gap-3">
            <button type="button" className={`btn ${cancelButtonClass}`} onClick={onClose}>
              {cancelButtonText}
            </button>
            <button type="button" className={`btn ${confirmButtonClass}`} onClick={onConfirm}>
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
