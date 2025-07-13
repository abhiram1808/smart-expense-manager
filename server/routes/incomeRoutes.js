// server/routes/incomeRoutes.js
import express from 'express';
import * as incomeController from '../controllers/incomeController.js';

const router = express.Router();

// --- CRUD Routes ---
router.post('/', incomeController.createIncome);
router.get('/', incomeController.getIncomes); // <--- CHANGED FROM getAllIncomes to getIncomes
router.put('/:id', incomeController.updateIncome);
router.delete('/:id', incomeController.deleteIncome);

// --- Analytics & Grouped List Routes ---
router.get('/summary/category', incomeController.getIncomeSummaryByCategory);
router.get('/grouped-by-month', incomeController.getIncomeGroupedByMonth);
router.get('/summary/monthly', incomeController.getMonthlyIncomeSummary);
router.get('/summary/source', incomeController.getIncomeSummaryBySource);
router.get('/summary/source-monthly', incomeController.getIncomeBySourceMonthly);

// --- Other Specific Query Routes (if needed by frontend) ---
router.get('/daterange', incomeController.getIncomeByDateRange);
router.get('/source-month', incomeController.getIncomeBySourceAndMonth);
router.get('/amount-month', incomeController.getIncomeByAmountRangeAndMonth);

export default router;
