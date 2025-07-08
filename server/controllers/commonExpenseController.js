// backend/controllers/commonExpenseController.js
import CommonExpense from '../models/CommonExpense.js';
import {
    getCommonExpenses as getCommonExpensesUtil,
    getCommonExpenseSummaryByCategory,
    getCommonExpenseSummaryByDayOfMonth,
    getTotalActiveCommonExpensesAmount
} from '../utils/commonExpenseAggregations.js';
import { autoInsertCommonExpenses } from '../utils/autoInsertCommonExpenses.js';

// Helper for consistent error handling in controllers
const handleControllerError = (res, err, message = 'Server error') => {
    console.error(`❌ ${message}:`, err);
    // Handle Mongoose validation errors specifically
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json({ error: 'Validation failed', details: errors.join(', ') });
    }
    // Handle custom error from schema pre-save hook
    if (err.message === 'End date cannot be before start date.') {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: message, details: err.message });
};

/**
 * @route POST /api/common-expenses
 * @desc Create a new common expense
 * @access Public (or Private/Auth)
 */

export const createCommonExpense = async (req, res) => {
    console.log('CommonExpenseController: createCommonExpense - Request body:', req.body);
    try {
        const { name, category, amount, dayOfMonth, startDate, endDate, termMonths, isActive } = req.body; // NEW: termMonths

        // Basic validation for required fields
        if (!name || !category || !amount || !dayOfMonth || !startDate) {
            return res.status(400).json({ error: 'Please enter all required fields: name, category, amount, dayOfMonth, startDate.' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number.' });
        }
        if (isNaN(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
            return res.status(400).json({ error: 'Day of month must be a number between 1 and 31.' });
        }

        const parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate.getTime())) {
            return res.status(400).json({ error: 'Invalid start date format.' });
        }

        let parsedEndDate = null;
        if (endDate) {
            parsedEndDate = new Date(endDate);
            if (isNaN(parsedEndDate.getTime())) {
                return res.status(400).json({ error: 'Invalid end date format.' });
            }
        }

        let parsedTermMonths = null;
        if (termMonths !== undefined && termMonths !== null && termMonths !== '') {
            parsedTermMonths = parseInt(termMonths);
            if (isNaN(parsedTermMonths) || parsedTermMonths < 1) {
                return res.status(400).json({ error: 'Term in months must be a positive number.' });
            }
        }

        // If both endDate and termMonths are provided, endDate takes precedence.
        // The model's pre-save hook will handle deriving endDate from termMonths if endDate is null.
        const newCommonExpense = await CommonExpense.create({
            name: name.trim(),
            category: category.trim(),
            amount: Number(amount),
            dayOfMonth: Number(dayOfMonth),
            startDate: parsedStartDate,
            endDate: parsedEndDate, // This will be used if provided, otherwise termMonths will calculate in pre-save
            termMonths: parsedTermMonths, // Store termMonths if provided
            isActive: typeof isActive === 'boolean' ? isActive : true,
            // user: req.user.id,
        });

        console.log('CommonExpenseController: Common expense created:', newCommonExpense);
        res.status(201).json(newCommonExpense);
    } catch (err) {
        handleControllerError(res, err, 'Failed to create common expense');
    }
};
/**
 * @route GET /api/common-expenses
 * @desc Get all common expenses with optional filters
 * @access Public (or Private/Auth)
 */
export const getCommonExpenses = async (req, res) => {
    console.log('CommonExpenseController: getCommonExpenses - Request Query:', req.query);
    try {
        const commonExpenses = await getCommonExpensesUtil(req.query); // Use the utility function
        console.log('CommonExpenseController: Fetched common expenses count:', commonExpenses.length);
        res.status(200).json(commonExpenses);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch common expenses');
    }
};

/**
 * @route GET /api/common-expenses/:id
 * @desc Get a single common expense by ID
 * @access Public (or Private/Auth)
 */
export const getCommonExpenseById = async (req, res) => {
    console.log('CommonExpenseController: getCommonExpenseById - Request ID:', req.params.id);
    try {
        const commonExpense = await CommonExpense.findById(req.params.id);

        if (!commonExpense) {
            return res.status(404).json({ error: 'Common expense not found' });
        }

        // if (req.user && commonExpense.user.toString() !== req.user.id) { // Uncomment if you add user authentication
        //     return res.status(401).json({ error: 'Not authorized to view this common expense' });
        // }

        res.status(200).json(commonExpense);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch common expense by ID');
    }
};

/**
 * @route PUT /api/common-expenses/:id
 * @desc Update a common expense by ID
 * @access Public (or Private/Auth)
 */
export const updateCommonExpense = async (req, res) => {
    console.log('CommonExpenseController: updateCommonExpense - Request ID:', req.params.id, 'Body:', req.body);
    try {
        const { name, category, amount, dayOfMonth, startDate, endDate, termMonths, isActive } = req.body; // NEW: termMonths

        const commonExpense = await CommonExpense.findById(req.params.id);

        if (!commonExpense) {
            return res.status(404).json({ error: 'Common expense not found' });
        }

        // Update fields if provided
        if (name) commonExpense.name = name.trim();
        if (category) commonExpense.category = category.trim();
        if (amount !== undefined) {
            if (isNaN(amount) || amount <= 0) {
                return res.status(400).json({ error: 'Amount must be a positive number.' });
            }
            commonExpense.amount = Number(amount);
        }
        if (dayOfMonth !== undefined) {
            if (isNaN(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
                return res.status(400).json({ error: 'Day of month must be a number between 1 and 31.' });
            }
            commonExpense.dayOfMonth = Number(dayOfMonth);
        }
        if (startDate !== undefined) {
            const parsedStartDate = new Date(startDate);
            if (isNaN(parsedStartDate.getTime())) {
                return res.status(400).json({ error: 'Invalid start date format.' });
            }
            commonExpense.startDate = parsedStartDate;
        }

        // Handle endDate: If explicitly set to null/empty string, clear it. Otherwise, parse.
        if (endDate === null || endDate === '') {
            commonExpense.endDate = null;
        } else if (endDate !== undefined) {
            const parsedEndDate = new Date(endDate);
            if (isNaN(parsedEndDate.getTime())) {
                return res.status(400).json({ error: 'Invalid end date format.' });
            }
            commonExpense.endDate = parsedEndDate;
        }

        // Handle termMonths: If explicitly set to null/empty string, clear it. Otherwise, parse.
        if (termMonths === null || termMonths === '') {
            commonExpense.termMonths = null;
        } else if (termMonths !== undefined) {
            const parsedTermMonths = parseInt(termMonths);
            if (isNaN(parsedTermMonths) || parsedTermMonths < 1) {
                return res.status(400).json({ error: 'Term in months must be a positive number.' });
            }
            commonExpense.termMonths = parsedTermMonths;
        }

        if (isActive !== undefined) {
            commonExpense.isActive = typeof isActive === 'boolean' ? isActive : commonExpense.isActive;
        }

        const updatedCommonExpense = await commonExpense.save();
        console.log('CommonExpenseController: Common expense updated:', updatedCommonExpense);
        res.status(200).json(updatedCommonExpense);
    } catch (err) {
        handleControllerError(res, err, 'Failed to update common expense');
    }
};

/**
 * @route DELETE /api/common-expenses/:id
 * @desc Delete a common expense by ID
 * @access Public (or Private/Auth)
 */
export const deleteCommonExpense = async (req, res) => {
    console.log('CommonExpenseController: deleteCommonExpense - Request ID:', req.params.id);
    try {
        const commonExpense = await CommonExpense.findById(req.params.id);

        if (!commonExpense) {
            return res.status(404).json({ error: 'Common expense not found' });
        }

        // if (req.user && commonExpense.user.toString() !== req.user.id) { // Uncomment if you add user authentication
        //     return res.status(401).json({ error: 'Not authorized to delete this common expense' });
        // }

        await CommonExpense.deleteOne({ _id: req.params.id });
        console.log('CommonExpenseController: Common expense deleted:', req.params.id);
        res.status(200).json({ message: 'Common expense removed successfully' });
    } catch (err) {
        handleControllerError(res, err, 'Failed to delete common expense');
    }
};

// --- Analytics-related Controllers for Common Expenses ---

/**
 * @route GET /api/common-expenses/summary/category
 * @desc Get common expense summary by category.
 * @access Public (or Private)
 */
export const getCommonExpenseSummaryByCategoryController = async (req, res) => {
    console.log('CommonExpenseController: getCommonExpenseSummaryByCategoryController - Request Query:', req.query);
    try {
        const summary = await getCommonExpenseSummaryByCategory(); // No year filter needed here
        console.log('CommonExpenseController: getCommonExpenseSummaryByCategoryController - Fetched summary count:', summary.length);
        res.status(200).json(summary);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch common expense summary by category');
    }
};

/**
 * @route GET /api/common-expenses/summary/day-of-month
 * @desc Get common expense summary by day of month.
 * @access Public (or Private)
 */
export const getCommonExpenseSummaryByDayOfMonthController = async (req, res) => {
    console.log('CommonExpenseController: getCommonExpenseSummaryByDayOfMonthController - Request Query:', req.query);
    try {
        const summary = await getCommonExpenseSummaryByDayOfMonth();
        console.log('CommonExpenseController: getCommonExpenseSummaryByDayOfMonthController - Fetched summary count:', summary.length);
        res.status(200).json(summary);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch common expense summary by day of month');
    }
};

/**
 * @route GET /api/common-expenses/total-active
 * @desc Get total amount of all active common expenses.
 * @access Public (or Private)
 */
export const getTotalActiveCommonExpensesAmountController = async (req, res) => {
    console.log('CommonExpenseController: getTotalActiveCommonExpensesAmountController - Request Query:', req.query);
    try {
        const totalAmount = await getTotalActiveCommonExpensesAmount();
        console.log('CommonExpenseController: getTotalActiveCommonExpensesAmountController - Fetched total amount:', totalAmount);
        res.status(200).json({ totalAmount });
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch total active common expenses amount');
    }
};
