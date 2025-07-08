// backend/routes/commonExpenseRoutes.js
import express from 'express';
import {
    createCommonExpense,
    getCommonExpenses,
    getCommonExpenseById,
    updateCommonExpense,
    deleteCommonExpense,
    getCommonExpenseSummaryByCategoryController, // This is now correct
    getCommonExpenseSummaryByDayOfMonthController, // This is now correct
    getTotalActiveCommonExpensesAmountController // This is now correct
} from '../controllers/commonExpenseController.js'; // ALL these functions are exported by commonExpenseController.js

const router = express.Router();

// --- Analytics Routes (More specific, should come before /:id) ---
router.get('/summary/category', getCommonExpenseSummaryByCategoryController);
router.get('/summary/day-of-month', getCommonExpenseSummaryByDayOfMonthController);
router.get('/total-active', getTotalActiveCommonExpensesAmountController); // Specific total route

// --- CRUD Routes ---
router.post('/', createCommonExpense);
router.get('/', getCommonExpenses); // General GET, can be used for flat list or filtered

// --- Specific GET by ID, PUT, DELETE (Wildcard routes, must come LAST) ---
router.get('/:id', getCommonExpenseById);
router.put('/:id', updateCommonExpense);
router.delete('/:id', deleteCommonExpense);

export default router;
