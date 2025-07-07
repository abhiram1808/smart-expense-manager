// backend/controllers/incomeController.js
import Income from '../models/Income.js';
// Import all necessary aggregation/query functions from the utilities file
import {
    getIncomes as getIncomesUtil, // For general GET /api/income (flat list with filters)
    getIncomeByMonthSummary as getIncomeByMonthSummaryUtil, // For monthly summary chart
    getIncomeSummaryBySource as getIncomeSummaryBySourceUtil, // For income by source chart
    getIncomeGroupedByMonth as getIncomeGroupedByMonthUtil, // For grouped list view
    getIncomeBySourceMonthly as getIncomeBySourceMonthlyUtil, // NEW: For income by source monthly chart
    getIncomeByDateRange as getIncomeByDateRangeUtil, // For date range queries
    getIncomeBySourceAndMonth as getIncomeBySourceAndMonthUtil, // For source & month queries
    getIncomeByAmountRangeAndMonth as getIncomeByAmountRangeAndMonthUtil, // For amount & month queries
   
} from '../utils/incomeAggregations.js'; // Ensure path is correct

// Helper for consistent error handling in controllers
const handleControllerError = (res, err, message = 'Server error') => {
    console.error(`❌ ${message}:`, err);
    res.status(500).json({ error: message, details: err.message });
};

// --- CRUD Operations for Income ---

/**
 * @route POST /api/income
 * @desc Create a new income record
 * @access Public (or Private, depending on auth setup)
 */
export const createIncome = async (req, res) => {
    console.log('IncomeController: createIncome - Request Body:', req.body);
    try {
        const { source, amount, date } = req.body;

        // Basic validation for presence
        if (!source || typeof amount === 'undefined' || amount === null || !date) {
            console.log('IncomeController: createIncome - Validation failed: Missing source, amount, or date.');
            return res.status(400).json({ error: 'Source, amount, and date are required.' });
        }

        // Validate amount is a positive number
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            console.log('IncomeController: createIncome - Validation failed: Amount must be a positive number.');
            return res.status(400).json({ error: 'Amount must be a positive number.' });
        }

        // Validate date format
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            console.log('IncomeController: createIncome - Validation failed: Invalid date format.', date);
            return res.status(400).json({ error: 'Invalid date format provided.' });
        }

        const newIncome = new Income({
            source,
            amount: parsedAmount,
            date: parsedDate,
            // year and month will be populated by the pre-save hook in the model
        });

        console.log('IncomeController: createIncome - New Income object before save:', newIncome);
        await newIncome.save();
        console.log('IncomeController: createIncome - New income saved successfully:', newIncome);
        res.status(201).json(newIncome);
    } catch (err) {
        handleControllerError(res, err, 'Failed to create income');
    }
};


/**
 * @route GET /api/income/summary/source-monthly
 * @desc Get income summary by source, month by month, for a given year.
 * @access Public (or Private)
 */
export const getIncomeBySourceMonthlyController = async (req, res) => { // NEW CONTROLLER
    console.log('IncomeController: getIncomeBySourceMonthlyController - Request Query:', req.query);
    try {
        const year = parseInt(req.query.year || new Date().getFullYear());
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year provided.' });
        }
        const summary = await getIncomeBySourceMonthlyUtil(year); // Call the new utility function
        console.log('IncomeController: getIncomeBySourceMonthlyController - Fetched summary count:', summary.length);
        res.status(200).json(summary);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch income by source monthly summary');
    }
};

/**
 * @route GET /api/income
 * @desc Get all income records (optionally with filters)
 * @access Public (or Private)
 */
export const getAllIncomes = async (req, res) => {
    console.log('IncomeController: getAllIncomes - Request Query:', req.query);
    try {
        const incomes = await getIncomesUtil(req.query); // Use the utility function with filters
        console.log('IncomeController: getAllIncomes - Fetched incomes count:', incomes.length);
        res.json(incomes);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch all incomes');
    }
};

/**
 * @route PUT /api/income/:id
 * @desc Update an income record by ID
 * @access Public (or Private)
 */
export const updateIncome = async (req, res) => {
    console.log('IncomeController: updateIncome - Request Params:', req.params, 'Request Body:', req.body);
    try {
        const { id } = req.params;
        const { source, amount, date } = req.body;

        // Basic validation for presence
        if (!source || typeof amount === 'undefined' || amount === null || !date) {
            console.log('IncomeController: updateIncome - Validation failed: Missing source, amount, or date.');
            return res.status(400).json({ error: 'Source, amount, and date are required for update.' });
        }

        // Validate amount is a positive number
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            console.log('IncomeController: updateIncome - Validation failed: Amount must be a positive number.');
            return res.status(400).json({ error: 'Amount must be a positive number.' });
        }

        // Validate date format
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            console.log('IncomeController: updateIncome - Validation failed: Invalid date format.', date);
            return res.status(400).json({ error: 'Invalid date format provided.' });
        }

        const updatedIncome = await Income.findByIdAndUpdate(
            id,
            { source, amount: parsedAmount, date: parsedDate }, // Mongoose pre-update hook will handle year/month/updatedAt
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updatedIncome) {
            console.log('IncomeController: updateIncome - Income not found for ID:', id);
            return res.status(404).json({ error: 'Income not found.' });
        }
        console.log('IncomeController: updateIncome - Income updated:', updatedIncome);
        res.status(200).json(updatedIncome);
    } catch (err) {
        handleControllerError(res, err, 'Failed to update income');
    }
};

/**
 * @route DELETE /api/income/:id
 * @desc Delete an income record
 * @access Public (or Private)
 */
export const deleteIncome = async (req, res) => {
    console.log('IncomeController: deleteIncome - Request Params:', req.params);
    try {
        const { id } = req.params;
        const deletedIncome = await Income.findByIdAndDelete(id);

        if (!deletedIncome) {
            console.log('IncomeController: deleteIncome - Income not found for ID:', id);
            return res.status(404).json({ error: 'Income not found.' });
        }
        console.log('IncomeController: deleteIncome - Income deleted:', deletedIncome);
        res.status(200).json({ message: 'Income deleted successfully.', deletedId: id });
    } catch (err) {
        handleControllerError(res, err, 'Failed to delete income');
    }
};

// --- Analytics-related Controllers ---

/**
 * @route GET /api/income/grouped-by-month
 * @desc Get incomes grouped by month and year for a given year (for the list view)
 * @access Public (or Private)
 */
export const getIncomeGroupedByMonth = async (req, res) => {
    console.log('IncomeController: getIncomeGroupedByMonth - Request Query:', req.query);
    try {
        const year = parseInt(req.query.year || new Date().getFullYear());
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year provided.' });
        }
        const groupedIncomes = await getIncomeGroupedByMonthUtil(year); // Use utility function
        console.log('IncomeController: getIncomeGroupedByMonth - Fetched grouped incomes count:', groupedIncomes.length);
        res.status(200).json(groupedIncomes);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch grouped incomes by month');
    }
};

/**
 * @route GET /api/income/summary/monthly
 * @desc Get monthly income summary for a given year (for analytics charts)
 * @access Public (or Private)
 */
export const getMonthlyIncomeSummary = async (req, res) => {
    console.log('IncomeController: getMonthlyIncomeSummary - Request Query:', req.query);
    try {
        const year = parseInt(req.query.year || new Date().getFullYear());
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year provided.' });
        }
        const summary = await getIncomeByMonthSummaryUtil(year); // Use utility function
        console.log('IncomeController: getMonthlyIncomeSummary - Fetched summary count:', summary.length);
        res.status(200).json(summary);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch monthly income summary');
    }
};

/**
 * @route GET /api/income/summary/source
 * @desc Get income summary by source for a given year
 * @access Public (or Private)
 */
export const getIncomeSummaryBySourceController = async (req, res) => {
    console.log('IncomeController: getIncomeSummaryBySourceController - Request Query:', req.query);
    try {
        const year = parseInt(req.query.year || new Date().getFullYear());
        if (isNaN(year)) {
            return res.status(400).json({ error: 'Invalid year provided.' });
        }
        const summary = await getIncomeSummaryBySourceUtil(year); // Use utility function
        console.log('IncomeController: getIncomeSummaryBySourceController - Fetched summary count:', summary.length);
        res.status(200).json(summary);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch income summary by source');
    }
};

// --- Other specific query controllers (if you want them to be handled here) ---
export const getIncomeByDateRangeController = async (req, res) => {
    console.log('IncomeController: getIncomeByDateRangeController - Request Query:', req.query);
    try {
        const { start, end } = req.query;
        if (!start || !end) return res.status(400).json({ error: 'start and end required' });
        const incomes = await getIncomeByDateRangeUtil(start, end);
        res.json(incomes);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch income by date range');
    }
};

export const getIncomeBySourceAndMonthController = async (req, res) => {
    console.log('IncomeController: getIncomeBySourceAndMonthController - Request Query:', req.query);
    try {
        const { source, month } = req.query;
        if (!source || !month) return res.status(400).json({ error: 'source and month required' });
        const incomes = await getIncomeBySourceAndMonthUtil(source, month);
        res.json(incomes);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch income by source and month');
    }
};

export const getIncomeByAmountRangeAndMonthController = async (req, res) => {
    console.log('IncomeController: getIncomeByAmountRangeAndMonthController - Request Query:', req.query);
    try {
        const { min, max, month } = req.query;
        if (!month) return res.status(400).json({ error: 'month required' });
        const incomes = await getIncomeByAmountRangeAndMonthUtil(min, max, month);
        res.json(incomes);
    } catch (err) {
        handleControllerError(res, err, 'Failed to fetch income by amount range and month');
    }
};

// backend/controllers/incomeController.js


