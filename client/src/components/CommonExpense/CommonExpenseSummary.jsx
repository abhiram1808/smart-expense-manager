// src/components/CommonExpenses/CommonExpenseSummary.jsx
import React, { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchTotalActiveCommonExpensesAmount } from '../../services/commonExpenseService';
import SkeletonLoader from '../common/SkeletonLoader';

/**
 * Displays a summary of common expenses, including total active amount,
 * and counts of active/inactive expenses.
 * @param {object} props - Component props.
 * @param {Array<Object>} props.commonExpenses - The full list of common expenses to derive counts.
 * @param {boolean} props.isLoading - Loading state from the parent hook.
 */
const CommonExpenseSummary = ({ commonExpenses, isLoading }) => {
  const [totalActiveAmount, setTotalActiveAmount] = useState(0);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  useEffect(() => {
    const loadSummary = async () => {
      setSummaryLoading(true);
      setSummaryError(null);
      try {
        const res = await fetchTotalActiveCommonExpensesAmount();
        setTotalActiveAmount(res.data.totalAmount || 0);
      } catch (err) {
        console.error("Error fetching total active common expenses amount:", err);
        setSummaryError(err);
        toast.error("Failed to load common expense summary.");
      } finally {
        setSummaryLoading(false);
      }
    };

    loadSummary();
  }, []); // Run once on mount

  const activeCount = commonExpenses.filter(exp => exp.isActive).length;
  const inactiveCount = commonExpenses.filter(exp => !exp.isActive).length;

  if (isLoading || summaryLoading) {
    return (
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <SkeletonLoader type="card" className="h-100" />
        </div>
        <div className="col-md-4">
          <SkeletonLoader type="card" className="h-100" />
        </div>
        <div className="col-md-4">
          <SkeletonLoader type="card" className="h-100" />
        </div>
      </div>
    );
  }

  if (summaryError) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading summary: {summaryError.message || 'Please check backend connection.'}
      </div>
    );
  }

  return (
    <div className="row g-3 mb-4">
      {/* Total Active Recurring Amount Card */}
      <div className="col-md-4">
        <div className="card shadow-lg h-100 border-primary" style={{ borderRadius: '15px', backgroundColor: '#e0f7fa' }}> {/* Enhanced styling */}
          <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
            <FaMoneyBillWave className="text-primary mb-3" size={40} /> {/* Larger icon */}
            <h6 className="card-title text-primary fw-bold mb-1">Total Active Recurring Amount</h6>
            <p className="display-5 text-primary mb-0 fw-bold"> {/* Larger, bolder text */}
              ₹{totalActiveAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Active Count Card */}
      <div className="col-md-4">
        <div className="card shadow-lg h-100 border-success" style={{ borderRadius: '15px', backgroundColor: '#e8f5e9' }}> {/* Enhanced styling */}
          <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
            <FaCheckCircle className="text-success mb-3" size={40} /> {/* Larger icon */}
            <h6 className="card-title text-success fw-bold mb-1">Active Recurring Expenses</h6>
            <p className="display-5 text-success mb-0 fw-bold">{activeCount}</p> {/* Larger, bolder text */}
          </div>
        </div>
      </div>

      {/* Inactive Count Card */}
      <div className="col-md-4">
        <div className="card shadow-lg h-100 border-danger" style={{ borderRadius: '15px', backgroundColor: '#ffebee' }}> {/* Enhanced styling */}
          <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
            <FaTimesCircle className="text-danger mb-3" size={40} /> {/* Larger icon */}
            <h6 className="card-title text-danger fw-bold mb-1">Inactive Recurring Expenses</h6>
            <p className="display-5 text-danger mb-0 fw-bold">{inactiveCount}</p> {/* Larger, bolder text */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonExpenseSummary;
