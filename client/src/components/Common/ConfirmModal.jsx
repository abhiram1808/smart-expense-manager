import React from 'react';

const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
