// src/components/common/SkeletonLoader.jsx
import React from 'react';

/**
 * A simple skeleton loader component.
 * Can be customized for different shapes (lines, cards) and counts.
 *
 * @param {object} props - The component props.
 * @param {number} [props.count=5] - Number of skeleton lines/items to display.
 * @param {string} [props.type='list-item'] - Type of skeleton ('list-item', 'card', 'text-line').
 * @param {string} [props.className=''] - Additional CSS classes.
 */
const SkeletonLoader = ({ count = 3, type = 'list-item', className = '' }) => {
  const renderListItemSkeleton = () => (
    <div className="d-flex align-items-center mb-3 p-3 border rounded bg-light" style={{ height: '60px' }}>
      <div className="flex-grow-1 me-3">
        <div className="skeleton-line" style={{ width: '80%', height: '18px', marginBottom: '8px' }}></div>
        <div className="skeleton-line" style={{ width: '60%', height: '14px' }}></div>
      </div>
      <div className="skeleton-line" style={{ width: '100px', height: '24px', borderRadius: '4px' }}></div>
    </div>
  );

  const renderTextLineSkeleton = () => (
    <div className="skeleton-line mb-2" style={{ width: '100%', height: '16px' }}></div>
  );

  const renderCardSkeleton = () => (
    <div className="card shadow-sm mb-4" style={{ borderRadius: '12px' }}>
      <div className="card-header" style={{ height: '50px', background: '#e0e0e0', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}></div>
      <div className="card-body p-4">
        <div className="skeleton-line mb-3" style={{ width: '90%', height: '20px' }}></div>
        <div className="skeleton-line mb-3" style={{ width: '70%', height: '20px' }}></div>
        <div className="skeleton-line" style={{ width: '85%', height: '20px' }}></div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'list-item':
        return renderListItemSkeleton();
      case 'card':
        return renderCardSkeleton();
      case 'text-line':
        return renderTextLineSkeleton();
      default:
        return renderListItemSkeleton();
    }
  };

  return (
    <div className={`skeleton-loader-container ${className}`}>
      {[...Array(count)].map((_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
      <style>{`
        .skeleton-line {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .skeleton-loader-container .card-header {
            background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;
