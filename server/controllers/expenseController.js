// backend/controllers/expenseController.js
import Expense from '../models/Expense.js'; // Ensure this path is correct for your Expense model
import { getExpensesGroupedByMonth, getExpensesByMonthSummary } from '../utils/expenseAggregations.js'; // Import aggregation functions

// Helper for consistent error handling in controllers
const handleControllerError = (res, err, message = 'Server error') => {
    console.error(`❌ ${message}:`, err);
    res.status(500).json({ error: message, details: err.message });
};

/**
 * @route POST /api/expenses
 * @desc Create a new expense record
 * @access Public (or Private, depending on auth setup)
 */
export const createExpense = async (req, res) => {
    try {
        const { category, amount, date, isRecurring } = req.body;

        // Basic validation
        if (!category || typeof amount !== 'number' || !date) {
            return res.status(400).json({ error: 'Category, amount (number), and date are required.' });
        }

        const newExpense = new Expense({
            category,
            amount,
            date: new Date(date), // Convert date string to Date object
            isRecurring: isRecurring !== undefined ? isRecurring : false, // Default to false if not provided
            // 'year' and 'month' fields can be automatically derived by Mongoose from 'date'
            // or populated by a pre-save hook if you strictly need them stored separately.
            // For now, we rely on aggregation to extract them.
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        handleControllerError(res, err, 'Failed to create expense');
    }
};

/**
 * @route GET /api/expenses/grouped-by-month
 * @desc Get expenses grouped by month and year for a given year
 * @access Public (or Private)
 */
export const getGroupedExpensesByMonth = async (req, res) => {
    try {
        const year = parseInt(req.query.year || new Date().getFullYear()); // Get year from query param or default to current year
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year provided. Must be a number.' });
        }
        const groupedExpenses = await getExpensesGroupedByMonth(year); // Call the aggregation utility
        res.status(200).json(groupedExpenses);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch grouped expenses by month');
    }
};

// You can add other controller functions here if needed, e.g., for simple flat list or summary
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch expenses');
    }
};

export const getMonthlyExpenseSummary = async (req, res) => {
    try {
        const year = parseInt(req.query.year || new Date().getFullYear());
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year provided.' });
        }
        const summary = await getExpensesByMonthSummary(year);
        res.status(200).json(summary);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch monthly expense summary');
    }
};

// NOTE: Update and Delete functions are not included here as per your request for the list view,
// but you would add them in this controller if you need them for other parts of your app.
// Example placeholder:
// export const updateExpense = async (req, res) => { /* ... update logic ... */ };
// export const deleteExpense = async (req, res) => { /* ... delete logic ... */ };
