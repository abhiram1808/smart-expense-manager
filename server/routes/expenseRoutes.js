// server/routes/expenseRoutes.js
import express from 'express';
const router = express.Router();
import * as expenseController from '../controllers/expenseController.js';

// Expense routes (standard, non-recurring)
router.post('/', expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);
router.get('/summary/category', expenseController.getExpenseSummaryByCategory);
router.get('/summary/monthly', expenseController.getMonthlyExpenseSummary); // <--- ROUTE PATH CHANGED
router.get('/summary/yearly', expenseController.getYearlyExpenseSummary);

// AI Insights route
router.get('/insights', expenseController.getSpendingInsights); // <--- NEW AI INSIGHTS ROUTE

export default router;
