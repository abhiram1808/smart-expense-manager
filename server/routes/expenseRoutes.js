// backend/routes/expenseRoutes.js
import express from 'express';
// Import the necessary controller functions
import {
    createExpense,
    getExpenses, // For the flat list (if still needed)
    getMonthlyExpenseSummary, // For the monthly summary (if still needed)
    getGroupedExpensesByMonth, // <--- THIS IS THE NEW ONE WE NEED
 
} from '../controllers/expenseController.js'; // Adjust path as necessary

const router = express.Router();

// Route to create a new expense
router.post('/', createExpense); // Handles POST /api/expenses

// Route to get all expenses (flat list) - Keep if you still need this endpoint
router.get('/', getExpenses); // Handles GET /api/expenses

// Route to get expenses grouped by month (for the new grouped list view)
router.get('/grouped-by-month', getGroupedExpensesByMonth); // Handles GET /api/expenses/grouped-by-month

// Route to get monthly expense summary - Keep if you still need this endpoint
router.get('/summary/monthly', getMonthlyExpenseSummary); // Handles GET /api/expenses/summary/monthly

// Routes for updating and deleting a specific expense by ID
// (These are included based on previous discussions, uncomment if you implement them)
// router.put('/:id', updateExpense); // Handles PUT /api/expenses/:id
// router.delete('/:id', deleteExpense); // Handles DELETE /api/expenses/:id

export default router;
