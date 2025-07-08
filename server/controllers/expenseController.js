// backend/controllers/expenseController.js
import Expense from '../models/Expense.js';

// Helper for consistent error handling in controllers
const handleControllerError = (res, err, message = 'Server error') => {
    console.error(`❌ ${message}:`, err);
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json({ error: 'Validation failed', details: errors.join(', ') });
    }
    res.status(500).json({ error: message, details: err.message });
};

// Function to set common no-cache headers
const setNoCacheHeaders = (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    // Crucial: Remove ETag and Last-Modified headers to prevent 304s
    res.removeHeader('ETag');
    res.removeHeader('Last-Modified');
};

/**
 * @route POST /api/expenses
 * @desc Create a new expense
 * @access Public (or Private/Auth)
 */
export const createExpense = async (req, res) => {
    console.log('ExpenseController: createExpense - Request body:', req.body);
    try {
        const { category, amount, date, description } = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({ error: 'Please enter all required fields: category, amount, date.' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number.' });
        }
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format.' });
        }

        const newExpense = await Expense.create({
            category: category.trim(),
            amount: Number(amount),
            date: parsedDate,
            description: description ? description.trim() : '',
        });

        console.log('ExpenseController: Expense created:', newExpense);
        setNoCacheHeaders(res); // Apply no-cache headers
        res.status(201).json(newExpense);
    } catch (err) {
        handleControllerError(res, err, 'Failed to create expense');
    }
};

/**
 * @route GET /api/expenses
 * @desc Get all expenses with optional filters (category, month, year, date range) and sorting
 * @access Public (or Private/Auth)
 */
export const getExpenses = async (req, res) => {
    console.log('ExpenseController: getExpenses - Request Query:', req.query);
    try {
        const query = {};
        const { category, month, year, startDate, endDate, sortBy, sortOrder } = req.query;

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }
        if (month) {
            query.month = Number(month);
        }
        if (year) {
            query.year = Number(year);
        }
        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                const start = new Date(startDate);
                if (isNaN(start.getTime())) {
                    return res.status(400).json({ error: 'Invalid startDate format.' });
                }
                query.date.$gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                if (isNaN(end.getTime())) {
                    return res.status(400).json({ error: 'Invalid endDate format.' });
                }
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        const sortOptions = {};
        const order = sortOrder === 'asc' ? 1 : -1;

        if (sortBy) {
            sortOptions[sortBy] = order;
        } else {
            sortOptions.date = -1;
        }

        const expenses = await Expense.find(query).sort(sortOptions);

        console.log('ExpenseController: Fetched expenses count:', expenses.length);
        setNoCacheHeaders(res); // Apply no-cache headers
        res.status(200).json(expenses);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch expenses');
    }
};

/**
 * @route GET /api/expenses/:id
 * @desc Get a single expense by ID
 * @access Public (or Private/Auth)
 */
export const getExpenseById = async (req, res) => {
    console.log('ExpenseController: getExpenseById - Request ID:', req.params.id);
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        setNoCacheHeaders(res); // Apply no-cache headers
        res.status(200).json(expense);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch expense by ID');
    }
};

/**
 * @route PUT /api/expenses/:id
 * @desc Update an expense by ID
 * @access Public (or Private/Auth)
 */
export const updateExpense = async (req, res) => {
    console.log('ExpenseController: updateExpense - Request ID:', req.params.id, 'Body:', req.body);
    try {
        const { category, amount, date, description } = req.body;

        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        if (category) expense.category = category.trim();
        if (amount !== undefined) {
            if (isNaN(amount) || amount <= 0) {
                return res.status(400).json({ error: 'Amount must be a positive number.' });
            }
            expense.amount = Number(amount);
        }
        if (date !== undefined) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ error: 'Invalid date format.' });
            }
            expense.date = parsedDate;
        }
        if (description !== undefined) {
            expense.description = description ? description.trim() : '';
        }

        const updatedExpense = await expense.save();
        console.log('ExpenseController: Expense updated:', updatedExpense);
        setNoCacheHeaders(res); // Apply no-cache headers
        res.status(200).json(updatedExpense);
    } catch (err) {
        handleControllerError(res, err, 'Failed to update expense');
    }
};

/**
 * @route DELETE /api/expenses/:id
 * @desc Delete an expense by ID
 * @access Public (or Private/Auth)
 */
export const deleteExpense = async (req, res) => {
    console.log('ExpenseController: deleteExpense - Request ID:', req.params.id);
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        await Expense.deleteOne({ _id: req.params.id });
        console.log('ExpenseController: Expense deleted:', req.params.id);
        setNoCacheHeaders(res); // Apply no-cache headers
        res.status(200).json({ message: 'Expense removed successfully' });
    } catch (err) {
        handleControllerError(res, err, 'Failed to delete expense');
    }
};

// --- Additional Analytics Endpoints ---

export const getExpenseSummaryByCategory = async (req, res) => {
    console.log('ExpenseController: getExpenseSummaryByCategory - Request Query:', req.query);
    try {
        const { month, year, startDate, endDate } = req.query;
        const matchQuery = {};

        if (month) matchQuery.month = Number(month);
        if (year) matchQuery.year = Number(year);

        if (startDate || endDate) {
            matchQuery.date = {};
            if (startDate) {
                const start = new Date(startDate);
                if (isNaN(start.getTime())) return res.status(400).json({ error: 'Invalid startDate format.' });
                matchQuery.date.$gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                if (isNaN(end.getTime())) return res.status(400).json({ error: 'Invalid endDate format.' });
                end.setHours(23, 59, 59, 999);
                matchQuery.date.$lte = end;
            }
        }

        const summary = await Expense.aggregate([
            { $match: matchQuery },
            { $group: { _id: '$category', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $project: { category: '$_id', totalAmount: 1, count: 1, _id: 0 } },
            { $sort: { totalAmount: -1 } }
        ]);
        setNoCacheHeaders(res); // Apply no-cache headers
        res.status(200).json(summary);
    } catch (err) {
        handleControllerError(res, err, 'Failed to get expense summary by category');
    }
};

export const getMonthlyExpenseSummary = async (req, res) => {
    console.log('ExpenseController: getMonthlyExpenseSummary - Request Query:', req.query);
    try {
        const { year } = req.query;
        if (!year) {
            return res.status(400).json({ error: 'Year is required for monthly summary.' });
        }

        const summary = await Expense.aggregate([
            { $match: { year: Number(year) } },
            { $group: { _id: '$month', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $project: { month: '$_id', totalAmount: 1, count: 1, _id: 0 } },
            { $sort: { month: 1 } }
        ]);
        setNoCacheHeaders(res); // Apply no-cache headers
        res.status(200).json(summary);
    } catch (err) {
        handleControllerError(res, err, 'Failed to get monthly expense summary');
    }
};

export const getYearlyExpenseSummary = async (req, res) => {
    console.log('ExpenseController: getYearlyExpenseSummary - Request Query:', req.query);
    try {
        const summary = await Expense.aggregate([
            { $group: { _id: '$year', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $project: { year: '$_id', totalAmount: 1, count: 1, _id: 0 } },
            { $sort: { year: 1 } }
        ]);
        setNoCacheHeaders(res); // Apply no-cache headers
        res.status(200).json(summary);
    } catch (err) {
        handleControllerError(res, err, 'Failed to get yearly expense summary');
    }
};
