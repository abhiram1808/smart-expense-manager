// backend/routes/incomeRoutes.js
import express from 'express';
import {
    createIncome,
    getAllIncomes,
    updateIncome,
    deleteIncome,
    getIncomeGroupedByMonth,
    getMonthlyIncomeSummary,
    getIncomeSummaryBySourceController,
    getIncomeBySourceMonthlyController, // NEW: Import the new controller
    getIncomeByDateRangeController,
    getIncomeBySourceAndMonthController,
    getIncomeByAmountRangeAndMonthController
} from '../controllers/incomeController.js';

const router = express.Router();

// --- CRUD Routes ---
router.post('/', createIncome);
router.get('/', getAllIncomes);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

// --- Analytics & Grouped List Routes ---
router.get('/grouped-by-month', getIncomeGroupedByMonth);
router.get('/summary/monthly', getMonthlyIncomeSummary);
router.get('/summary/source', getIncomeSummaryBySourceController);
router.get('/summary/source-monthly', getIncomeBySourceMonthlyController); // NEW ROUTE

// --- Other Specific Query Routes (if needed by frontend) ---
router.get('/daterange', getIncomeByDateRangeController);
router.get('/source-month', getIncomeBySourceAndMonthController);
router.get('/amount-month', getIncomeByAmountRangeAndMonthController);

export default router;
