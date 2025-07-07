import CommonExpense from '../models/CommonExpense.js';

// Get Active Common Expenses
export const getActiveCommonExpenses = async () => {
  return await CommonExpense.find({ isActive: true });
};

// Get Common Expenses by Category
export const getCommonExpensesByCategory = async (category) => {
  return await CommonExpense.find({ category, isActive: true });
};

// Get Common Expenses by Date Range
export const getCommonExpensesByDateRange = async (startDate, endDate) => {
  return await CommonExpense.find({
    startDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    isActive: true
  });
};

// Get Common Expenses Summary
export const getCommonExpensesSummary = async () => {
  const summary = await CommonExpense.aggregate([
    { $group: { _id: '$category', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $project: { category: '$_id', totalAmount: 1, count: 1, _id: 0 } }
  ]);
  return summary;
};

// Get Common Expenses by Month
export const getCommonExpensesByMonth = async (year) => {
  return await CommonExpense.aggregate([
    { $match: { isActive: true, startDate: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
    { $group: { _id: { $month: '$startDate' }, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $project: { month: '$_id', totalAmount: 1, count: 1, _id: 0 } }
  ]);
};

// Get Common Expenses by Year
export const getCommonExpensesByYear = async (year) => {
  return await CommonExpense.aggregate([
    { $match: { isActive: true, startDate: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
    { $group: { _id: { $year: '$startDate' }, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $project: { year: '$_id', totalAmount: 1, count: 1, _id: 0 } }
  ]);
};

// Get Common Expenses by Duration
export const getCommonExpensesByDuration = async (duration) => {
  return await CommonExpense.aggregate([
    { $match: { isActive: true, duration: { $gte: duration } } },
    { $group: { _id: '$duration', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $project: { duration: '$_id', totalAmount: 1, count: 1, _id: 0 } }
  ]);
};

// Get Common Expenses by Amount Range
export const getCommonExpensesByAmountRange = async (minAmount, maxAmount) => {
  return await CommonExpense.aggregate([
    { $match: { isActive: true, amount: { $gte: minAmount, $lte: maxAmount } } },
    { $group: { _id: null, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $project: { totalAmount: 1, count: 1, _id: 0 } }
  ]);
};

// Get Common Expenses by Active Status
export const getCommonExpensesByActiveStatus = async (isActive) => {
  return await CommonExpense.find({ isActive }).sort({ createdAt: -1 });
};
