// src/App.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Your existing Sidebar component
import AddExpensePage from './pages/AddExpensePage';
import ExpenseListPage from './pages/ExpenseListPage';
import AnalyticsPage from './pages/AnalyticsPage'; // Your existing income/overview analytics page

// Correctly import your pages
import MonthlyIncomePage from './pages/MonthlyIncomePage';
import MonthlyBudgetPage from './pages/MonthlyBudgetPage';
import CommonExpensesPage from './pages/CommonExpensesPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import BudgetAnalyticsPage from './pages/BudgetAnalyticsPage'; // <--- NEW: Import the Budget Analytics Page

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure Toastify CSS is imported
import 'bootstrap/dist/css/bootstrap.min.css'; // Assuming Bootstrap CSS is used
//import 'animate.css/animate.min.css'; // Assuming Animate.css is used for animations


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
            <Route path="/add-expense" element={<AddExpensePage />} />
            <Route path="/expenses" element={<ExpenseListPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} /> {/* Your existing income/overview analytics */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* NEW: Route for Budget Analytics Page */}
            <Route path="/budget-analytics" element={<BudgetAnalyticsPage />} />

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
