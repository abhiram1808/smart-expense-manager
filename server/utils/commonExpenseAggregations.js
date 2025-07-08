// backend/utils/commonExpenseAggregations.js
import CommonExpense from '../models/CommonExpense.js'; // Ensure this path correctly points to your CommonExpense model

// Helper for consistent error handling and logging in aggregation functions
const handleAggregationError = (error, functionName) => {
    console.error(`❌ Error in ${functionName} aggregation:`, error);
    throw new Error(`Failed to perform ${functionName}: ${error.message}`);
};

/**
 * Fetches all common expense records, with optional filtering and sorting.
 * This function is used by the main GET /api/common-expenses route.
 * @param {object} filters - Object containing optional filters (e.g., { category, isActive }).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of common expense documents.
 */
export const getCommonExpenses = async (filters = {}) => {
    try {
        const query = {};
        const { category, isActive } = filters;

        if (category) {
            query.category = { $regex: category, $options: 'i' }; // Case-insensitive search
        }
        if (isActive !== undefined) {
            query.isActive = isActive === 'true'; // Convert string to boolean
        }

        // Ensure sorting by dayOfMonth and name, as per schema design
        return await CommonExpense.find(query).sort({ dayOfMonth: 1, name: 1 });
    } catch (error) {
        handleAggregationError(error, 'getCommonExpenses');
    }
};

/**
 * Aggregates common expenses by category.
 * Useful for a pie chart showing the distribution of your recurring expenses by category.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects,
 * each representing a category's total recurring amount.
 * Example: [{ category: 'Rent', totalAmount: 25000 }, { category: 'Utilities', totalAmount: 2500 }]
 */
export const getCommonExpenseSummaryByCategory = async () => {
    try {
        const summary = await CommonExpense.aggregate([
            {
                $match: { isActive: true } // Only consider active common expenses for summary
            },
            {
                $group: {
                    _id: '$category', // Group by the 'category' field
                    totalAmount: { $sum: '$amount' }, // Sum the 'amount' for each category
                    count: { $sum: 1 } // Count common expenses per category
                }
            },
            {
                $project: {
                    category: '$_id', // Rename _id to category
                    totalAmount: 1,
                    count: 1,
                    _id: 0 // Exclude _id from the final output
                }
            },
            {
                $sort: { totalAmount: -1 } // Sort by total amount descending
            }
        ]);
        return summary;
    } catch (error) {
        handleAggregationError(error, 'getCommonExpenseSummaryByCategory');
    }
};

/**
 * Aggregates common expenses by day of month.
 * Useful for seeing which days of the month have the highest recurring expenses.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects,
 * each representing a day of the month with its total recurring amount.
 * Example: [{ day: 1, totalAmount: 30000 }, { day: 15, totalAmount: 5000 }]
 */
export const getCommonExpenseSummaryByDayOfMonth = async () => {
    try {
        const summary = await CommonExpense.aggregate([
            {
                $match: { isActive: true } // Only consider active common expenses
            },
            {
                $group: {
                    _id: '$dayOfMonth', // Group by the 'dayOfMonth' field
                    totalAmount: { $sum: '$amount' }, // Sum the 'amount' for each day
                    count: { $sum: 1 } // Count common expenses per day
                }
            },
            {
                $project: {
                    day: '$_id', // Rename _id to day
                    totalAmount: 1,
                    count: 1,
                    _id: 0 // Exclude _id from the final output
                }
            },
            {
                $sort: { day: 1 } // Sort by day ascending
            }
        ]);
        return summary;
    } catch (error) {
        handleAggregationError(error, 'getCommonExpenseSummaryByDayOfMonth');
    }
};

/**
 * Calculates the total amount of all active common expenses.
 * @returns {Promise<number>} A promise that resolves to the total amount.
 */
export const getTotalActiveCommonExpensesAmount = async () => {
    try {
        const result = await CommonExpense.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $group: {
                    _id: null, // Group all documents into a single group
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalAmount: 1
                }
            }
        ]);
        return result.length > 0 ? result[0].totalAmount : 0;
    } catch (error) {
        handleAggregationError(error, 'getTotalActiveCommonExpensesAmount');
    }
};
