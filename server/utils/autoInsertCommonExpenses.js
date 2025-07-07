// utils/autoInsertCommonExpenses.js
import CommonExpense from '../models/CommonExpense.js';
import Expense from '../models/Expense.js';

export const autoInsertCommonExpenses = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  const commonExpenses = await CommonExpense.find({ isActive: true });

  for (const exp of commonExpenses) {
    const start = new Date(exp.startDate);
    const duration = exp.duration || 999; // fallback to very long
    const end = new Date(start);
    end.setMonth(end.getMonth() + duration);

    // ❌ Skip if not valid for this month
    if (today < start || today > end) continue;

    // ✅ Check if already inserted for this month
    const exists = await Expense.findOne({
      category: exp.category,
      isRecurring: true,
      year,
      month,
    });

    if (!exists) {
      await Expense.create({
        category: exp.category,
        amount: exp.amount,
        date: today,
        isRecurring: true,
        year,
        month,
      });
      console.log(`✅ Inserted recurring expense: ${exp.category}`);
    }
  }
};
