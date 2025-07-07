// components/Common/ExpenseAlerts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/alerts');
        setAlerts(res.data.slice(0, 5)); // Show top 5
      } catch (err) {
        console.error('Error fetching alerts:', err);
      }
    };

    fetchAlerts();
  }, []);

  const dismissAlert = (index) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  const getBgClass = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'warning':
        return 'bg-warning text-dark';
      case 'danger':
        return 'bg-danger text-white';
      case 'info':
      default:
        return 'bg-info text-white';
    }
  };

  return (
    <div className="mb-3">
      {alerts.map((alert, idx) => (
        <div key={idx} className={`toast show ${getBgClass(alert.type)} mb-2`} role="alert">
          <div className="d-flex justify-content-between align-items-center toast-body">
            <div>
              <strong>{alert.message}</strong>{' '}
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                ({new Date(alert.createdAt).toLocaleDateString()})
              </span>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white ms-2"
              aria-label="Close"
              onClick={() => dismissAlert(idx)}
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseAlerts;
