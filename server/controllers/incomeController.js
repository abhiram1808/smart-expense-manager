// server/controllers/incomeController.js
import Income from '../models/Income.js';

// Helper function to apply common filters (for getIncomes)
const applyIncomeFilters = (reqQuery) => {
  const filter = {};
  if (reqQuery.startDate) {
    filter.date = { ...filter.date, $gte: new Date(reqQuery.startDate) };
  }
  if (reqQuery.endDate) {
    filter.date = { ...filter.date, $lte: new Date(reqQuery.endDate) };
  }
  if (reqQuery.month) {
    filter.month = parseInt(reqQuery.month);
  }
  if (reqQuery.year) {
    filter.year = parseInt(reqQuery.year);
  }
  if (reqQuery.category) {
    filter.category = reqQuery.category;
  }
  return filter;
};

// @desc    Create a new income
// @route   POST /api/incomes
// @access  Public
export const createIncome = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    const newIncome = new Income({
      description,
      amount,
      category,
      date,
      month: new Date(date).getMonth() + 1, // Store 1-indexed month
      year: new Date(date).getFullYear(),
      // user: req.user.id, // Uncomment if using authentication
    });
    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (err) {
    console.error('Error creating income:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get all incomes with filtering, sorting, and pagination
// @route   GET /api/incomes
// @access  Public
export const getIncomes = async (req, res) => { // Renamed from getAllIncomes for consistency
  try {
    const filter = applyIncomeFilters(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const incomes = await Income.find(filter)
      .sort({ date: -1 }) // Default sort by date descending
      .skip(skip)
      .limit(limit);

    const totalCount = await Income.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      incomes,
      totalCount,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (err) {
    console.error('Error getting incomes:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update an income
// @route   PUT /api/incomes/:id
// @access  Public
export const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, date } = req.body;
    const updatedFields = {
      description,
      amount,
      category,
      date,
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
    };
    const updatedIncome = await Income.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedIncome) {
      return res.status(404).json({ error: 'Income not found' });
    }
    res.status(200).json(updatedIncome);
  } catch (err) {
    console.error('Error updating income:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete an income
// @route   DELETE /api/incomes/:id
// @access  Public
export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIncome = await Income.findByIdAndDelete(id);
    if (!deletedIncome) {
      return res.status(404).json({ error: 'Income not found' });
    }
    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (err) {
    console.error('Error deleting income:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// --- Analytics & Grouped List Routes Implementations ---

// @desc    Get income summary by category
// @route   GET /api/incomes/summary/category
// @access  Public
export const getIncomeSummaryByCategory = async (req, res) => {
  try {
    const { year, month } = req.query;
    const match = {};
    if (year) match.year = parseInt(year);
    if (month) match.month = parseInt(month);

    const summary = await Income.aggregate([
      { $match: match },
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
      { $sort: { totalAmount: -1 } },
    ]);
    res.status(200).json(summary);
  } catch (err) {
    console.error('Backend: getIncomeSummaryByCategory - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get income grouped by month
// @route   GET /api/incomes/grouped-by-month
// @access  Public
export const getIncomeGroupedByMonth = async (req, res) => {
  try {
    const { year } = req.query;
    const match = {};
    if (year) match.year = parseInt(year);

    const groupedData = await Income.aggregate([
      { $match: match },
      { $group: {
          _id: { month: '$month', year: '$year' },
          totalAmount: { $sum: '$amount' },
          incomes: { $push: '$$ROOT' } // Push all docs into an array
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    res.status(200).json(groupedData);
  } catch (err) {
    console.error('Backend: getIncomeGroupedByMonth - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get monthly income summary for a given year
// @route   GET /api/incomes/summary/monthly
// @access  Public
export const getMonthlyIncomeSummary = async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    if (isNaN(year)) {
      // If year is not provided or invalid, get for current year
      req.query.year = new Date().getFullYear();
    }
    const summary = await Income.aggregate([
      { $match: { year: parseInt(req.query.year) } },
      { $group: { _id: '$month', totalAmount: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(summary);
  } catch (err) {
    console.error('Backend: getMonthlyIncomeSummary - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get income summary by source/category (alias for getIncomeSummaryByCategory if source means category)
// @route   GET /api/incomes/summary/source
// @access  Public
export const getIncomeSummaryBySource = async (req, res) => {
  try {
    const { year, month } = req.query;
    const match = {};
    if (year) match.year = parseInt(year);
    if (month) match.month = parseInt(month);

    const summary = await Income.aggregate([
      { $match: match },
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } }, // Assuming 'source' is equivalent to 'category'
      { $sort: { totalAmount: -1 } },
    ]);
    res.status(200).json(summary);
  } catch (err) {
    console.error('Backend: getIncomeSummaryBySource - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get income by source/category monthly
// @route   GET /api/incomes/summary/source-monthly
// @access  Public
export const getIncomeBySourceMonthly = async (req, res) => {
  try {
    const { year } = req.query;
    const match = {};
    if (year) match.year = parseInt(year);

    const summary = await Income.aggregate([
      { $match: match },
      { $group: {
          _id: { month: '$month', category: '$category' },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.month': 1, '_id.category': 1 } }
    ]);
    res.status(200).json(summary);
  } catch (err) {
    console.error('Backend: getIncomeBySourceMonthly - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get income by date range
// @route   GET /api/incomes/daterange
// @access  Public
export const getIncomeByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate) {
      filter.date = { ...filter.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filter.date = { ...filter.date, $lte: new Date(endDate) };
    }

    const incomes = await Income.find(filter).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (err) {
    console.error('Backend: getIncomeByDateRange - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get income by source/category and month
// @route   GET /api/incomes/source-month
// @access  Public
export const getIncomeBySourceAndMonth = async (req, res) => {
  try {
    const { category, month, year } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);

    const incomes = await Income.find(filter).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (err) {
    console.error('Backend: getIncomeBySourceAndMonth - Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get income by amount range and month
// @route   GET /api/incomes/amount-month
// @access  Public
export const getIncomeByAmountRangeAndMonth = async (req, res) => {
  try {
    const { minAmount, maxAmount, month, year } = req.query;
    const filter = {};
    if (minAmount) filter.amount = { ...filter.amount, $gte: parseFloat(minAmount) };
    if (maxAmount) filter.amount = { ...filter.amount, $lte: parseFloat(maxAmount) };
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);

    const incomes = await Income.find(filter).sort({ amount: -1 });
    res.status(200).json(incomes);
  } catch (err) {
    console.error('Backend: getIncomeByAmountRangeAndMonth - Error:', err);
    res.status(500).json({ error: err.message });
  }
};
