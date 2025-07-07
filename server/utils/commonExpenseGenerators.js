import Expense from '../models/Expense.js';
import dayjs from 'dayjs';

// Generate Monthly Expense Entries
export const generateMonthlyExpenses = async (commonExpense) => {
  const { category, amount, startDate, duration, _id } = commonExpense;
  const entries = [];
  for (let i = 0; i < duration; i++) {
    const date = dayjs(startDate).add(i, 'month').startOf('month').toDate();
    entries.push({
      category,
      amount,
      date,
      isRecurring: true,
      commonExpenseId: _id
    });
  }
  await Expense.insertMany(entries);
  return entries.length;
};
