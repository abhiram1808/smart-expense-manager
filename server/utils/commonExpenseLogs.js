import CommonExpenseLog from '../models/CommonExpenseLog.js';

// Log Common Expense Changes
export const logCommonExpenseChange = async ({
  commonExpenseId,
  action,
  previousData,
  updatedData,
  description
}) => {
  await CommonExpenseLog.create({
    commonExpenseId,
    action,
    previousData,
    updatedData,
    description
  });
};

// Get Common Expense Logs
export const getCommonExpenseLogs = async (commonExpenseId) => {
  return await CommonExpenseLog.find({ commonExpenseId }).sort({ createdAt: -1 });
};
