// backend/routes/expenseRoutes.js
import express from 'express';
import {
    createExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getExpenseSummaryByCategory,
    getMonthlyExpenseSummary,
    getYearlyExpenseSummary
} from '../controllers/expenseController.js';

const router = express.Router();

// --- CRUD Routes ---
router.route('/').get(getExpenses).post(createExpense);
router.route('/:id').get(getExpenseById).put(updateExpense).delete(deleteExpense);

// --- Analytics/Summary Routes ---
router.get('/summary/category', getExpenseSummaryByCategory);
router.get('/summary/monthly', getMonthlyExpenseSummary);
router.get('/summary/yearly', getYearlyExpenseSummary);

export default router;
