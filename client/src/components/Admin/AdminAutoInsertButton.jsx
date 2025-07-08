// src/components/Admin/AdminAutoInsertButton.jsx
import React, { useState } from 'react';
import { runAutoInsert } from '../../services/commonExpenseService'; // <--- Now this import will work!
import { toast } from 'react-toastify'; // Import toast for user feedback

/**
 * Admin button component to manually trigger the common expense auto-insertion process.
 */
const AdminAutoInsertButton = () => {
  const [loading, setLoading] = useState(false);
  // Removed local status state, will rely on toast for feedback directly

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await runAutoInsert();
      toast.success('✅ ' + (res.data.message || 'Auto-insertion triggered successfully!'));
    } catch (err) {
      console.error('❌ Failed to trigger auto-insert:', err);
      toast.error('❌ Failed: ' + (err.response?.data?.error || err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-3" style={{ borderRadius: '12px', backgroundColor: '#fff' }}>
      <h5 className="mb-3 text-primary">⚙️ Admin: Trigger Auto Insert</h5>
      <p className="text-muted mb-3">Manually run the process that inserts recurring expenses based on your Common Expenses definitions. This runs automatically via cron daily, but can be triggered here for testing or immediate needs.</p>
      <button className="btn btn-primary" onClick={handleClick} disabled={loading}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Running...
          </>
        ) : (
          'Run Auto Insert Now'
        )}
      </button>
    </div>
  );
};

export default AdminAutoInsertButton;
