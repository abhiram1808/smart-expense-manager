// client/src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome, FaMoneyBillWave, FaChartLine, FaDollarSign, FaPiggyBank,
  FaCalendarAlt, FaCog, FaUserShield, FaHistory
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px', minHeight: '100vh' }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <FaPiggyBank className="me-2" size={30} />
        <span className="fs-4">Smart Expense</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}
            aria-current="page"
          >
            <FaHome className="me-2" />
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/daily-expenses"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}
          >
            <FaMoneyBillWave className="me-2" />
            Daily Expenses
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/expenses"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}
          >
            <FaHistory className="me-2" />
            Expense History
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/monthly-income"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}
          >
            <FaDollarSign className="me-2" />
            Monthly Income
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/monthly-budget"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}
          >
            <FaPiggyBank className="me-2" />
            Monthly Budget
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/common-expenses" // Route remains the same
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}
          >
            <FaCalendarAlt className="me-2" />
            Recurring Expenses {/* <--- RENAMED TEXT */}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/expense-analytics"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}
          >
            <FaChartLine className="me-2" />
            Expense Analytics
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/budget-analytics"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}
          >
            <FaChartLine className="me-2" />
            Budget Analytics
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/common-expense-analytics"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}
          >
            <FaChartLine className="me-2" />
            Recurring Analytics {/* <--- RENAMED TEXT */}
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/analytics"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}
          >
            <FaChartLine className="me-2" />
            Income Analytics
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}
          >
            <FaUserShield className="me-2" />
            Admin
          </NavLink>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />
          <strong>User Name</strong>
        </a>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
          <li><a className="dropdown-item" href="#">New project...</a></li>
          <li><a className="dropdown-item" href="#">Settings</a></li>
          <li><a className="dropdown-item" href="#">Profile</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="#">Sign out</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
