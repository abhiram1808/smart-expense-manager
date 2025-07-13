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

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, category, sortBy = 'date', sortOrder = 'desc' } = req.query;
    const filter = {};

    // Ensure date is filtered as a string in 'YYYY-MM-DD' format
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      filter.date = { $gte: startDate };
    } else if (endDate) {
      filter.date = { $lte: endDate };
    }

    if (category) {
      filter.category = category;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Debug log for backend
    console.log('expenseRoutes: Filter being used:', filter);

    const expenses = await Expense.find(filter).sort(sort);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
