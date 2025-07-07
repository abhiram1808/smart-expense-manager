// backend/routes/budgetRoutes.js
import express from 'express';
import {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    getBudgetGroupedByMonthController,
    getBudgetSummaryByCategoryController,
    getMonthlyBudgetSummaryController
} from '../controllers/budgetController.js';

const router = express.Router();

// --- Analytics Routes (MOST SPECIFIC, should come FIRST) ---
router.get('/summary/category', getBudgetSummaryByCategoryController); // Moved to top
router.get('/summary/monthly', getMonthlyBudgetSummaryController);     // Moved to top

// --- Grouped List Route (More specific than /:id, but less than /summary/...) ---
router.get('/grouped-by-month', getBudgetGroupedByMonthController);

// --- CRUD Routes ---
router.post('/', createBudget);
router.get('/', getBudgets); // General GET, can be used for flat list or filtered

// --- Specific GET by ID, PUT, DELETE (Wildcard routes, must come LAST) ---
router.get('/:id', getBudgetById);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
