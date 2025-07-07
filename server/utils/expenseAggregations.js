// backend/utils/expenseAggregations.js
import Expense from '../models/Expense.js'; // Ensure this path is correct for your Expense model

// Helper for consistent error handling and logging
const handleAggregationError = (error, functionName) => {
    console.error(`❌ Error in ${functionName} aggregation:`, error);
    throw new Error(`Failed to perform ${functionName}: ${error.message}`);
};

/**
 * Aggregates expenses and groups them by month and year, including individual items.
 * This function is designed to provide data for the grouped list view on the frontend.
 *
 * It uses the 'date' field from your Expense model for grouping and filtering,
 * and 'amount' for summing.
 *
 * @param {number} year - The year for which to aggregate data.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of grouped expense objects.
 * Each group includes a 'key' (e.g., "YYYY-MM"), 'label' (e.g., "Month YYYY"),
 * 'date' (a Date object for sorting groups), 'total' (sum of amounts for the month),
 * and an 'items' array containing the individual expense documents for that month.
 */
export const getExpensesGroupedByMonth = async (year) => {
    try {
        if (!year || typeof year !== 'number') {
            throw new Error('A valid year (number) is required for grouped expenses aggregation.');
        }

        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        const groupedExpenses = await Expense.aggregate([
            {
                // Match expenses within the specified year using the 'date' field
                $match: {
                    date: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                // Extract year and month from the 'date' field to use for grouping
                $addFields: {
                    expenseYear: { $year: '$date' },
                    expenseMonth: { $month: '$date' } // Month number (1-12)
                }
            },
            {
                // Group documents by year and month
                $group: {
                    _id: {
                        year: '$expenseYear',
                        month: '$expenseMonth'
                    },
                    total: { $sum: '$amount' }, // Sum the 'amount' field for each group
                    items: { $push: '$$ROOT' } // Push the entire original expense document into an 'items' array
                }
            },
            {
                // Reshape the output documents
                $project: {
                    _id: 0, // Exclude the default _id from the group
                    key: {
                        // Create a unique key for the group (e.g., "2025-06")
                        $concat: [
                            { $toString: '$_id.year' },
                            '-',
                            { $cond: { if: { $lt: ['$_id.month', 10] }, then: { $concat: ['0', { $toString: '$_id.month' }] }, else: { $toString: '$_id.month' } } } // Format month as MM
                        ]
                    },
                    label: {
                        // Create a human-readable label for the group (e.g., "June 2025")
                        $dateToString: {
                            format: '%B %Y',
                            date: {
                                $dateFromParts: {
                                    year: '$_id.year',
                                    month: '$_id.month',
                                    day: 1 // Use day 1 for consistent date object for label
                                }
                            }
                        }
                    },
                    date: {
                        // Create a Date object for the group, useful for sorting groups on the frontend
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: 1 // Use day 1 for consistent date object for sorting
                        }
                    },
                    total: 1, // Include the calculated total amount for the group
                    items: 1 // Include the array of individual expense items
                }
            },
            {
                // Sort the groups by their date in descending order (most recent month first)
                $sort: { date: -1 }
            }
        ]);

        return groupedExpenses;
    } catch (error) {
        handleAggregationError(error, 'getExpensesGroupedByMonth');
    }
};

// You can add other aggregation functions here if needed, e.g., getExpensesByMonthSummary for a simple chart
export const getExpensesByMonthSummary = async (year) => {
    try {
        if (!year || typeof year !== 'number') {
            throw new Error('A valid year (number) is required for monthly expense summary.');
        }
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        const summary = await Expense.aggregate([
            { $match: { date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: { $month: '$date' }, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $project: { month: '$_id', totalAmount: 1, count: 1, _id: 0 } },
            { $sort: { month: 1 } }
        ]);

        const fullYearSummary = Array.from({ length: 12 }, (_, i) => {
            const monthNum = i + 1;
            const existingMonth = summary.find(item => item.month === monthNum);
            return existingMonth || { month: monthNum, totalAmount: 0, count: 0 };
        });
        return fullYearSummary;
    } catch (error) {
        handleAggregationError(error, 'getExpensesByMonthSummary');
    }
};
