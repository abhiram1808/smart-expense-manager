// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaList,
  FaChartPie,
  FaMoneyBillWave,
  FaPiggyBank,
  FaCog,
  FaUserShield,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const [openAnalytics, setOpenAnalytics] = useState(false);

  // Check if current path is within analytics sub-paths to keep it open
  const isAnalyticsPathActive = location.pathname === '/analytics' || location.pathname === '/budget-analytics' || location.pathname === '/common-expense-analytics';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/expenses', label: 'Expenses', icon: <FaList /> },
    {
      label: 'Analytics', // Parent item for Analytics
      icon: <FaChartPie />,
      children: [
        { path: '/analytics', label: 'Income & Expense Analytics' },
        { path: '/budget-analytics', label: 'Budget Analytics' },
        { path: '/common-expense-analytics', label: 'Recurring Expense Analytics' }
      ]
    },
    { path: '/monthly-income', label: 'Income', icon: <FaMoneyBillWave /> },
    { path: '/monthly-budget', label: 'Budget', icon: <FaPiggyBank /> },
    { path: '/common-expenses', label: 'Recurring Expenses', icon: <FaCog /> },
    { path: '/admin', label: 'Admin', icon: <FaUserShield /> }
  ];

  // Effect to automatically open Analytics dropdown if one of its children is active
  React.useEffect(() => {
    if (isAnalyticsPathActive) {
      setOpenAnalytics(true);
    }
  }, [isAnalyticsPathActive]);


  return (
    <div className="sidebar bg-dark text-white p-3" style={{ minWidth: '220px', height: '100vh', overflowY: 'auto' }}>
      <h4 className="mb-4">💼 Expense App</h4>
      <ul className="nav flex-column gap-2" role="navigation"> {/* Use role="navigation" on the main ul if it's the primary nav */}
        {navItems.map((item, index) => (
          item.children ? ( // If the item has children, render it as a dropdown
            <li key={index} className={`nav-item ${isAnalyticsPathActive ? 'bg-secondary rounded' : ''}`}>
              {/* Use a button for the toggle, with aria-controls and aria-expanded */}
              <button
                className="nav-link text-white d-flex align-items-center justify-content-between w-100" // w-100 to make button fill space
                onClick={() => setOpenAnalytics(!openAnalytics)}
                aria-expanded={openAnalytics}
                aria-controls={`analytics-submenu-${index}`} // Link to the submenu's ID
                style={{ cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }} // Reset button default styles
              >
                <div className="d-flex align-items-center gap-2">
                  {item.icon} {item.label}
                </div>
                {openAnalytics ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
              </button>
              {openAnalytics && ( // Conditionally render children if dropdown is open
                <ul id={`analytics-submenu-${index}`} className="nav flex-column ps-4 pt-1 pb-1" style={{ listStyle: 'none' }}>
                  {item.children.map(child => (
                    <li key={child.path} className={`nav-item ${location.pathname === child.path ? 'bg-secondary rounded' : ''}`}>
                      <Link
                        to={child.path}
                        className="nav-link text-white d-flex align-items-center gap-2 py-1"
                        aria-current={location.pathname === child.path ? 'page' : undefined}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ) : ( // If no children, render as a regular link
            <li key={item.path} className={`nav-item ${location.pathname === item.path ? 'bg-secondary rounded' : ''}`}>
              <Link
                to={item.path}
                className="nav-link text-white d-flex align-items-center gap-2"
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                {item.icon} {item.label}
              </Link>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
