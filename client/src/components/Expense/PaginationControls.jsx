import React from 'react';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [...Array(totalPages).keys()].map((n) => n + 1);

  return (
    <nav className="mt-3">
      <ul className="pagination">
        {pageNumbers.map((num) => (
          <li
            key={num}
            className={`page-item ${currentPage === num ? 'active' : ''}`}
          >
            <button className="page-link" onClick={() => onPageChange(num)}>
              {num}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PaginationControls;
