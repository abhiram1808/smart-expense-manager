// server/routes/commonExpenseRoutes.js
import express from 'express';
const router = express.Router();
import * as commonExpenseController from '../controllers/commonExpenseController.js';

// Routes for managing common expense templates (recurring expenses)
router.post('/', commonExpenseController.createCommonExpense);
router.get('/', commonExpenseController.getCommonExpenses);
router.put('/:id', commonExpenseController.updateCommonExpense);
router.delete('/:id', commonExpenseController.deleteCommonExpense);

// Automation trigger route
router.post('/generate', commonExpenseController.generateRecurringExpenses);

// Analytics routes for common expenses (recurring templates)
router.get('/summary/category', commonExpenseController.getCommonExpenseSummaryByCategory);
router.get('/summary/day-of-month', commonExpenseController.getCommonExpenseSummaryByDayOfMonth);
router.get('/total-active', commonExpenseController.getTotalActiveCommonExpensesAmount); // <--- Matches frontend service

export default router;
