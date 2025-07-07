import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

router.get('/recurring-vs-nonrecurring', async (req, res) => {
  const expenses = await Expense.find();

  let recurringTotal = 0;
  let manualTotal = 0;
  const monthlyMap = {};

  expenses.forEach((exp) => {
    const monthKey = `${exp.date.getFullYear()}-${exp.date.getMonth() + 1}`;
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { recurring: 0, manual: 0 };
    }

    if (exp.isRecurring) {
      recurringTotal += exp.amount;
      monthlyMap[monthKey].recurring += exp.amount;
    } else {
      manualTotal += exp.amount;
      monthlyMap[monthKey].manual += exp.amount;
    }
  });

  const monthlyBreakdown = Object.entries(monthlyMap).map(([month, data]) => ({
    month,
    ...data,
  }));

  res.json({ recurringTotal, manualTotal, monthlyBreakdown });
});

export default router;
