import React from 'react';

const IncomeCard = ({ amount }) => (
  <div className="col-md-3">
    <div className="card p-3 shadow-sm rounded-3">
      <h6>💰 Income</h6>
      <h4>₹{typeof amount === 'number' ? amount : '...'}</h4>
    </div>
  </div>
);

export default IncomeCard;
