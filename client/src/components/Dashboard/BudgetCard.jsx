import React from 'react';

const BudgetCard = ({ amount }) => (
  <div className="col-md-3">
    <div className="card p-3 shadow-sm rounded-3">
      <h6>📋 Budget</h6>
      <h4>₹{amount}</h4>
    </div>
  </div>
);

export default BudgetCard;
