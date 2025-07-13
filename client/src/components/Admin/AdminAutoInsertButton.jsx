// client/src/components/Admin/AdminAutoInsertButton.jsx
import React, { useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
// Import the correctly named function from your commonExpenseService
import { triggerRecurringExpenseGeneration } from '../../services/commonExpenseService'; // <--- CORRECTED IMPORT

const AdminAutoInsertButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Call the correctly named function
      const response = await triggerRecurringExpenseGeneration(); // <--- CORRECTED FUNCTION CALL
      toast.success(response.data.message || 'Recurring expenses generated successfully!');
    } catch (error) {
      console.error('Error triggering auto-insertion:', error);
      toast.error(`Failed to trigger auto-insertion: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      className="btn btn-info text-white d-flex align-items-center"
      onClick={handleGenerate}
      disabled={isGenerating}
    >
      <FaSyncAlt className="me-2" />
      {isGenerating ? 'Generating...' : 'Run Recurring Expense Automation'}
    </button>
  );
};

export default AdminAutoInsertButton;
