import express from 'express';
import {
  createCommonExpense,
  updateCommonExpense,
  deleteCommonExpense,
  getCommonExpenseLogs,
  getAllCommonExpenses
} from '../controllers/commonExpenseController.js';
import {
  getActiveCommonExpenses,
  getCommonExpensesByCategory,
  getCommonExpensesByDateRange,
  getCommonExpensesSummary,
  getCommonExpensesByMonth,
  getCommonExpensesByYear,
  getCommonExpensesByDuration,
  getCommonExpensesByAmountRange,
  getCommonExpensesByActiveStatus,
  getCommonExpensesByCategoryAndDateRange,
  getCommonExpensesByCategoryAndDuration,
  getCommonExpensesByCategoryAndAmountRange,
  getCommonExpensesByCategoryAndActiveStatus,
  getCommonExpensesByDateRangeAndActiveStatus,
  getCommonExpensesByDurationAndActiveStatus,
  getCommonExpensesByAmountRangeAndActiveStatus
} from '../utils/commonExpenseUtils.js';

const router = express.Router();

// POST /api/common-expense
router.post('/', createCommonExpense);

// PUT /api/common-expense/:id
router.put('/:id', updateCommonExpense);

// DELETE /api/common-expense/:id
router.delete('/:id', deleteCommonExpense);

// GET /api/common-expense/:id/logs
router.get('/:id/logs', getCommonExpenseLogs);

// GET /api/common-expenses
router.get('/', getAllCommonExpenses);

// --- Advanced Query/Filter Routes ---
router.get('/active', async (req, res) => {
  res.json(await getActiveCommonExpenses());
});
router.get('/category/:category', async (req, res) => {
  res.json(await getCommonExpensesByCategory(req.params.category));
});
router.get('/daterange', async (req, res) => {
  const { start, end } = req.query;
  res.json(await getCommonExpensesByDateRange(start, end));
});
router.get('/summary', async (req, res) => {
  res.json(await getCommonExpensesSummary());
});
router.get('/month/:year', async (req, res) => {
  res.json(await getCommonExpensesByMonth(req.params.year));
});
router.get('/year/:year', async (req, res) => {
  res.json(await getCommonExpensesByYear(req.params.year));
});
router.get('/duration/:duration', async (req, res) => {
  res.json(await getCommonExpensesByDuration(Number(req.params.duration)));
});
router.get('/amountrange', async (req, res) => {
  const { min, max } = req.query;
  res.json(await getCommonExpensesByAmountRange(Number(min), Number(max)));
});
router.get('/active-status/:isActive', async (req, res) => {
  res.json(await getCommonExpensesByActiveStatus(req.params.isActive === 'true'));
});
router.get('/category-daterange', async (req, res) => {
  const { category, start, end } = req.query;
  res.json(await getCommonExpensesByCategoryAndDateRange(category, start, end));
});
router.get('/category-duration', async (req, res) => {
  const { category, duration } = req.query;
  res.json(await getCommonExpensesByCategoryAndDuration(category, Number(duration)));
});
router.get('/category-amountrange', async (req, res) => {
  const { category, min, max } = req.query;
  res.json(await getCommonExpensesByCategoryAndAmountRange(category, Number(min), Number(max)));
});
router.get('/category-active', async (req, res) => {
  const { category, isActive } = req.query;
  res.json(await getCommonExpensesByCategoryAndActiveStatus(category, isActive === 'true'));
});
router.get('/daterange-active', async (req, res) => {
  const { start, end, isActive } = req.query;
  res.json(await getCommonExpensesByDateRangeAndActiveStatus(start, end, isActive === 'true'));
});
router.get('/duration-active', async (req, res) => {
  const { duration, isActive } = req.query;
  res.json(await getCommonExpensesByDurationAndActiveStatus(Number(duration), isActive === 'true'));
});
router.get('/amountrange-active', async (req, res) => {
  const { min, max, isActive } = req.query;
  res.json(await getCommonExpensesByAmountRangeAndActiveStatus(Number(min), Number(max), isActive === 'true'));
});

export default router;
