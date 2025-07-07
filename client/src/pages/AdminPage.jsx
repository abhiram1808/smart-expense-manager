// pages/AdminPage.jsx
import React from 'react';
import AdminAutoInsertButton from '../components/Admin/AdminAutoInsertButton';

const AdminPage = () => {
  return (
    <div className="container mt-4">
      <h3>🛠 Admin Tools</h3>
      <AdminAutoInsertButton />
    </div>
  );
};

export default AdminPage;
// This page serves as an admin dashboard where you can add more admin tools in the future.