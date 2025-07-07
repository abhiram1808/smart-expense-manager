import React, { useState } from 'react';
import { runAutoInsert } from '../../services/commonExpenseService';

const AdminAutoInsertButton = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    setLoading(true);
    setStatus('');
    try {
      const res = await runAutoInsert();
      setStatus('✅ ' + res.data.message);
    } catch (err) {
      setStatus('❌ Failed: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 border rounded shadow-sm bg-light">
      <h5 className="mb-2">🔁 Admin: Trigger Auto Insert</h5>
      <button className="btn btn-primary" onClick={handleClick} disabled={loading}>
        {loading ? 'Running...' : 'Run Auto Insert'}
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default AdminAutoInsertButton;
