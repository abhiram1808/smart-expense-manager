// backend/controllers/budgetController.js
import Budget from '../models/Budget.js';
// Import all necessary aggregation/query functions from the utilities file
import {
    getBudgets as getBudgetsUtil,
    getBudgetGroupedByMonth as getBudgetGroupedByMonthUtil,
    getBudgetSummaryByCategory as getBudgetSummaryByCategoryUtil, // THIS MUST BE IMPORTED
    getBudgetByMonthSummary as getBudgetByMonthSummaryUtil // THIS MUST BE IMPORTED
} from '../utils/budgetAggregations.js'; // Ensure path is correct

// Helper for consistent error handling in controllers
const handleControllerError = (res, err, message = 'Server error') => {
    console.error(`❌ ${message}:`, err);
    // Check if it's a duplicate key error (MongoDB error code 11000)
    if (err.code === 11000) {
        // Extract the duplicate field from the error message
        const field = Object.keys(err.keyValue).join(', ');
        return res.status(409).json({ error: `Duplicate budget entry. A budget for this ${field} already exists.` });
    }
    res.status(500).json({ error: message, details: err.message });
};

/**
 * @route POST /api/budget
 * @desc Create a new budget
 * @access Public (or Private/Auth)
 */
export const createBudget = async (req, res) => {
    console.log('BudgetController: createBudget - Request body:', req.body);
    try {
        const { category, amount, month, year } = req.body;

        // Simple validation
        if (!category || !amount || !month || !year) {
            return res.status(400).json({ error: 'Please enter all required fields: category, amount, month, year.' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number.' });
        }
        if (isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({ error: 'Month must be a number between 1 and 12.' });
        }
        if (isNaN(year) || year < 2000) { // Arbitrary start year
            return res.status(400).json({ error: 'Year must be a valid number (e.g., 2000 or later).' });
        }

        const newBudget = await Budget.create({
            category: category.trim(),
            amount: Number(amount),
            month: Number(month),
            year: Number(year),
            // user: req.user.id, // Uncomment if you add user authentication
        });

        console.log('BudgetController: Budget created:', newBudget);
        res.status(201).json(newBudget);
    } catch (err) {
        handleControllerError(res, err, 'Failed to create budget');
    }
};

/**
 * @route GET /api/budget
 * @desc Get all budgets with optional filters (by year, month, category)
 * @access Public (or Private/Auth)
 */
export const getBudgets = async (req, res) => {
    console.log('BudgetController: getBudgets - Request Query:', req.query);
    try {
        const budgets = await getBudgetsUtil(req.query); // Use the utility function
        console.log('BudgetController: Fetched budgets count:', budgets.length);
        res.status(200).json(budgets);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch budgets');
    }
};

/**
 * @route GET /api/budget/:id
 * @desc Get a single budget by ID
 * @access Public (or Private/Auth)
 */
export const getBudgetById = async (req, res) => {
    console.log('BudgetController: getBudgetById - Request ID:', req.params.id);
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        res.status(200).json(budget);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch budget by ID');
    }
};

/**
 * @route PUT /api/budget/:id
 * @desc Update a budget by ID
 * @access Public (or Private/Auth)
 */
export const updateBudget = async (req, res) => {
    console.log('BudgetController: updateBudget - Request ID:', req.params.id, 'Body:', req.body);
    try {
        const { category, amount, month, year } = req.body;

        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        // Update fields if provided
        if (category) budget.category = category.trim();
        if (amount !== undefined) {
            if (isNaN(amount) || amount <= 0) {
                return res.status(400).json({ error: 'Amount must be a positive number.' });
            }
            budget.amount = Number(amount);
        }
        if (month !== undefined) {
            if (isNaN(month) || month < 1 || month > 12) {
                return res.status(400).json({ error: 'Month must be a number between 1 and 12.' });
            }
            budget.month = Number(month);
        }
        if (year !== undefined) {
            if (isNaN(year) || year < 2000) {
                return res.status(400).json({ error: 'Year must be a valid number (e.g., 2000 or later).' });
            }
            budget.year = Number(year);
        }

        const updatedBudget = await budget.save();
        console.log('BudgetController: Budget updated:', updatedBudget);
        res.status(200).json(updatedBudget);
    } catch (err) {
        handleControllerError(res, err, 'Failed to update budget');
    }
};

/**
 * @route DELETE /api/budget/:id
 * @desc Delete a budget by ID
 * @access Public (or Private/Auth)
 */
export const deleteBudget = async (req, res) => {
    console.log('BudgetController: deleteBudget - Request ID:', req.params.id);
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        await Budget.deleteOne({ _id: req.params.id });
        console.log('BudgetController: Budget deleted:', req.params.id);
        res.status(200).json({ message: 'Budget removed successfully' });
    } catch (err) {
        handleControllerError(res, err, 'Failed to delete budget');
    }
};

/**
 * @route GET /api/budget/grouped-by-month
 * @desc Get budgets grouped by month and year for a given year (for the list view)
 * @access Public (or Private)
 */
export const getBudgetGroupedByMonthController = async (req, res) => {
    console.log('BudgetController: getBudgetGroupedByMonthController - Request Query:', req.query);
    try {
        const year = parseInt(req.query.year || new Date().getFullYear());
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year provided.' });
        }
        const groupedBudgets = await getBudgetGroupedByMonthUtil(year);
        console.log('BudgetController: getBudgetGroupedByMonthController - Fetched grouped budgets count:', groupedBudgets.length);
        res.status(200).json(groupedBudgets);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch grouped budgets by month');
    }
};

/**
 * @route GET /api/budget/summary/category
 * @desc Get budget summary by category for a given year.
 * @access Public (or Private)
 */
export const getBudgetSummaryByCategoryController = async (req, res) => { // <--- THIS FUNCTION MUST BE EXPORTED
    console.log('BudgetController: getBudgetSummaryByCategoryController - Request Query:', req.query);
    try {
        const year = parseInt(req.query.year || new Date().getFullYear());
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year provided.' });
        }
        const summary = await getBudgetSummaryByCategoryUtil(year); // Call the new utility function
        console.log('BudgetController: getBudgetSummaryByCategoryController - Fetched summary count:', summary.length);
        res.status(200).json(summary);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch budget summary by category');
    }
};

/**
 * @route GET /api/budget/summary/monthly
 * @desc Get monthly budget summary for a given year.
 * @access Public (or Private)
 */
export const getMonthlyBudgetSummaryController = async (req, res) => { // <--- THIS FUNCTION MUST BE EXPORTED
    console.log('BudgetController: getMonthlyBudgetSummaryController - Request Query:', req.query);
    try {
        const year = parseInt(req.query.year || new Date().getFullYear());
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year provided.' });
        }
        const summary = await getBudgetByMonthSummaryUtil(year); // Call the new utility function
        console.log('BudgetController: getMonthlyBudgetSummaryController - Fetched summary count:', summary.length);
        res.status(200).json(summary);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch monthly budget summary');
    }
};
