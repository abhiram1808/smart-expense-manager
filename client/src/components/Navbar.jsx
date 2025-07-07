// src/pages/MonthlyBudgetPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BudgetForm from '../components/Budget/BudgetForm';
import BudgetList from '../components/Budget/BudgetList';
import { fetchBudget } from '../services/budgetService';

const MonthlyBudgetPage = () => {
  const [budget, setBudget] = useState([]);

  useEffect(() => {
    fetchBudget().then(res => setBudget(res));
  }, []);

  const handleAdd = (newEntry) => {
    setBudget([...budget, newEntry]);
  };

  return (
    <div className="container">
      <h2 className="mb-3">Monthly Budget</h2>
      <BudgetForm onAdd={handleAdd} />
      <BudgetList budget={budget} />
      <Link to="/budget">Budget</Link>
    </div>
  );
};

export default MonthlyBudgetPage;