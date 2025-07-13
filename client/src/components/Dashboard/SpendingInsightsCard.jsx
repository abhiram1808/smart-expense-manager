// client/src/components/Dashboard/SpendingInsightsCard.jsx
import React, { useState, useEffect } from 'react';
import { fetchSpendingInsights } from '../../services/expenseService';
import ErrorDisplay from '../common/ErrorDisplay';
import SkeletonLoader from '../common/SkeletonLoader';
import { FaLightbulb, FaSpinner } from 'react-icons/fa'; // Added FaSpinner for loading

/**
 * Displays AI-powered spending insights.
 * Fetches insights from the backend AI endpoint.
 */
const SpendingInsightsCard = () => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getInsights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchSpendingInsights();
        setInsights(response.data.insights);
      } catch (err) {
        console.error('Error fetching AI spending insights:', err.response?.data || err.message);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getInsights();
  }, []);

  if (isLoading) {
    return (
      <div className="card shadow-sm h-100" style={{ borderRadius: '12px' }}>
        <div className="card-body">
          <h5 className="card-title text-primary d-flex align-items-center mb-3">
            <FaLightbulb className="me-2" /> AI Spending Insights
          </h5>
          <div className="text-center py-5">
            <FaSpinner className="fa-spin text-primary mb-3" size={30} />
            <p className="text-muted">Generating insights...</p>
            <SkeletonLoader type="paragraph" count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card shadow-sm h-100" style={{ borderRadius: '12px' }}>
        <div className="card-body">
          <h5 className="card-title text-primary d-flex align-items-center mb-3">
            <FaLightbulb className="me-2" /> AI Spending Insights
          </h5>
          <ErrorDisplay error={error} message="Failed to load AI spending insights." />
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100" style={{ borderRadius: '12px' }}>
      <div className="card-body">
        <h5 className="card-title text-primary d-flex align-items-center mb-3">
          <FaLightbulb className="me-2" /> AI Spending Insights
        </h5>
        {insights ? (
          <div className="card-text" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }} />
        ) : (
          <p className="text-muted text-center py-4">No insights available at this moment. Ensure you have enough expense data for analysis.</p>
        )}
      </div>
    </div>
  );
};

export default SpendingInsightsCard;
