import CommonExpense from '../models/CommonExpense.js';

// Get Common Expenses by Category and Date Range
export const getCommonExpensesByCategoryAndDateRange = async (category, startDate, endDate) => {
  return await CommonExpense.find({
    category,
    startDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    isActive: true
  });
};

// Get Common Expenses by Category and Duration
export const getCommonExpensesByCategoryAndDuration = async (category, duration) => {
  return await CommonExpense.find({
    category,
    duration: { $gte: duration },
    isActive: true
  });
};

// Get Common Expenses by Category and Amount Range
export const getCommonExpensesByCategoryAndAmountRange = async (category, minAmount, maxAmount) => {
  return await CommonExpense.find({
    category,
    amount: { $gte: minAmount, $lte: maxAmount },
    isActive: true
  });
};

// Get Common Expenses by Category and Active Status
export const getCommonExpensesByCategoryAndActiveStatus = async (category, isActive) => {
  return await CommonExpense.find({
    category,
    isActive
  }).sort({ createdAt: -1 });
};

// Get Common Expenses by Date Range and Active Status
export const getCommonExpensesByDateRangeAndActiveStatus = async (startDate, endDate, isActive) => {
  return await CommonExpense.find({
    startDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
    isActive
  }).sort({ createdAt: -1 });
};

// Get Common Expenses by Duration and Active Status
export const getCommonExpensesByDurationAndActiveStatus = async (duration, isActive) => {
  return await CommonExpense.find({
    duration: { $gte: duration },
    isActive
  }).sort({ createdAt: -1 });
};

// Get Common Expenses by Amount Range and Active Status
export const getCommonExpensesByAmountRangeAndActiveStatus = async (minAmount, maxAmount, isActive) => {
  return await CommonExpense.find({
    amount: { $gte: minAmount, $lte: maxAmount },
    isActive
  }).sort({ createdAt: -1 });
};
