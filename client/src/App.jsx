// src/App.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

// Import your pages
import MonthlyIncomePage from './pages/MonthlyIncomePage';
import MonthlyBudgetPage from './pages/MonthlyBudgetPage';
import CommonExpensesPage from './pages/CommonExpensesPage';
import ExpenseListPage from './pages/ExpenseListPage'; // Consolidated Expense Page
import AnalyticsPage from './pages/AnalyticsPage'; // Your existing income/overview analytics page
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import BudgetAnalyticsPage from './pages/BudgetAnalyticsPage';
import CommonExpenseAnalyticsPage from './pages/CommonExpenseAnalyticsPage';

// NEW: Import the ExpenseAnalyticsPage
import ExpenseAnalyticsPage from './pages/ExpenseAnalyticsPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'animate.css/animate.min.css';


const App = () => {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar (left) */}
        <Sidebar />

        {/* Main content (right) */}
        <div style={{ flex: 1, padding: '2rem', background: '#f8f9fa' }}>
          <Routes>
            {/* Existing Routes */}
            <Route path="/monthly-income" element={<MonthlyIncomePage />} />
            <Route path="/monthly-budget" element={<MonthlyBudgetPage />} />
            <Route path="/common-expenses" element={<CommonExpensesPage />} />
            <Route path="/expenses" element={<ExpenseListPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/budget-analytics" element={<BudgetAnalyticsPage />} />
            <Route path="/common-expense-analytics" element={<CommonExpenseAnalyticsPage />} />

            {/* NEW: Route for Expense Analytics Page */}
            <Route path="/expense-analytics" element={<ExpenseAnalyticsPage />} />

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
