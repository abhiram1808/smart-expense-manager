// src/components/common/ErrorDisplay.jsx
import React from 'react';

/**
 * A reusable component to display error messages.
 * @param {object} props - The component props.
 * @param {Error|Object|string} props.error - The error object or message to display.
 * @param {string} [props.message='An unexpected error occurred.'] - A general message to show.
 */
const ErrorDisplay = ({ error, message = 'An unexpected error occurred.' }) => {
  let errorMessage = message;
  if (error) {
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.response && error.response.data && error.response.data.error) {
      // For Axios errors with a backend error message
      errorMessage = error.response.data.error;
    }
  }

  return (
    <div className="alert alert-danger text-center mt-4" role="alert" style={{ borderRadius: '8px' }}>
      <h4 className="alert-heading">Error!</h4>
      <p>{errorMessage}</p>
      {error && error.details && (
        <small className="d-block text-muted">Details: {error.details}</small>
      )}
      <hr />
      <p className="mb-0">Please try again later or contact support if the issue persists.</p>
    </div>
  );
};

export default ErrorDisplay;
