import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const SidebarLayout = () => {
  return (
    <div className="d-flex ">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
