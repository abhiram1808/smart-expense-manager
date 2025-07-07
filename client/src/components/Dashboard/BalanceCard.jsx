import React from 'react';

const BalanceCard = ({ balance }) => (
  <div className="col-md-3">
    <div className="card p-3 shadow-sm rounded-3">
      <h6>🧮 Balance</h6>
      <h4 className={typeof balance === 'number' ? (balance < 0 ? 'text-danger' : 'text-success') : ''}>
        ₹{typeof balance === 'number' ? balance : '...'}
      </h4>
    </div>
  </div>
);

export default BalanceCard;
