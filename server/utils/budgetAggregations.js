// backend/utils/budgetAggregations.js
import Budget from '../models/Budget.js'; // Ensure this path correctly points to your Budget model

// Helper for consistent error handling and logging in aggregation functions
const handleAggregationError = (error, functionName) => {
    console.error(`❌ Error in ${functionName} aggregation:`, error);
    throw new Error(`Failed to perform ${functionName}: ${error.message}`);
};

/**
 * Fetches all budget records, with optional filtering and sorting.
 * This is for a flat list view, if still needed.
 * @param {object} filters - Object containing optional filters (e.g., { month, year, category }).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of budget documents.
 */
export const getBudgets = async (filters = {}) => {
    try {
        const query = {};
        const { year, month, category } = filters;

        if (year) {
            const yearNum = parseInt(year);
            if (!isNaN(yearNum)) query.year = yearNum;
        }

        if (month) {
            const monthNum = parseInt(month);
            if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) query.month = monthNum;
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' }; // Case-insensitive search
        }

        return await Budget.find(query).sort({ year: -1, month: -1, category: 1 });
    } catch (error) {
        handleAggregationError(error, 'getBudgets');
    }
};

/**
 * Aggregates budgets and groups them by month and year, including individual budget items.
 * This is designed to support the grouped list view on the frontend.
 *
 * @param {number} year - The year for which to aggregate data.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of grouped budget objects.
 * Each group includes a label, total amount for the month, and an array of individual budget items.
 * Example: [{ key: '2025-06', label: 'June 2025', date: DateObject, total: 1500, items: [...] }, ...]
 */
export const getBudgetGroupedByMonth = async (year) => {
    try {
        if (!year || typeof year !== 'number') {
            throw new Error('A valid year (number) is required for grouped budgets.');
        }

        const groupedBudgets = await Budget.aggregate([
            {
                $match: {
                    year: year // Filter by the specified year
                }
            },
            {
                $group: {
                    _id: {
                        year: '$year',
                        month: '$month'
                    },
                    total: { $sum: '$amount' }, // Summing on 'amount' field
                    items: { $push: '$$ROOT' } // Push the entire budget document into 'items' array
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id from the group
                    key: {
                        $concat: [
                            { $toString: '$_id.year' },
                            '-',
                            { $cond: { if: { $lt: ['$_id.month', 10] }, then: { $concat: ['0', { $toString: '$_id.month' }] }, else: { $toString: '$_id.month' } } } // Format month as MM
                        ]
                    },
                    label: {
                        $dateToString: {
                            format: '%B %Y', // Format as "Month Year" (e.g., "June 2025")
                            date: {
                                $dateFromParts: {
                                    year: '$_id.year',
                                    month: '$_id.month',
                                    day: 1 // Use day 1 for consistent date object
                                }
                            }
                        }
                    },
                    date: { // Create a proper Date object for sorting groups on frontend
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: 1
                        }
                    },
                    total: 1, // Include the total amount
                    items: 1 // Include the array of individual budget items
                }
            },
            {
                $sort: { date: -1 } // Sort groups by date descending (most recent month first)
            }
        ]);

        return groupedBudgets;
    } catch (error) {
        handleAggregationError(error, 'getBudgetGroupedByMonth');
    }
};

/**
 * Aggregates budget by category for a given year.
 * This is perfect for a Pie Chart showing budget allocation by category.
 *
 * @param {number} year - The year for which to aggregate data.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects,
 * each representing a category's total budgeted amount.
 * Example: [{ category: 'Groceries', totalAmount: 5000 }, { category: 'Rent', totalAmount: 20000 }]
 */
export const getBudgetSummaryByCategory = async (year) => {
    try {
        if (!year || typeof year !== 'number') {
            throw new Error('A valid year (number) is required for budget summary by category.');
        }

        const summary = await Budget.aggregate([
            {
                $match: {
                    year: year // Filter by the specified year
                }
            },
            {
                $group: {
                    _id: '$category', // Group by the 'category' field
                    totalAmount: { $sum: '$amount' }, // Sum the 'amount' for each category
                    count: { $sum: 1 } // Count documents per category
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
        handleAggregationError(error, 'getBudgetSummaryByCategory');
    }
};

/**
 * Aggregates budget by month for a given year.
 * Ensures all 12 months are present in the output, even if totalAmount is 0.
 *
 * @param {number} year - The year for which to aggregate data.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects,
 * each representing a month's total budgeted amount and count of budgets.
 * Example: [{ month: 1, totalAmount: 1500, count: 5 }, ...]
 */
export const getBudgetByMonthSummary = async (year) => {
    try {
        if (!year || typeof year !== 'number') {
            throw new Error('A valid year (number) is required for monthly budget summary.');
        }

        const summary = await Budget.aggregate([
            {
                $match: {
                    year: year // Filter by the specified year
                }
            },
            {
                $group: {
                    _id: '$month', // <--- FIX: Group directly by the 'month' number field
                    totalAmount: { $sum: '$amount' }, // Sum 'amount' for each month
                    count: { $sum: 1 } // Count budgets per month
                }
            },
            {
                $project: {
                    month: '$_id', // Rename _id to month
                    totalAmount: 1,
                    count: 1,
                    _id: 0 // Exclude _id from the final output
                }
            },
            {
                $sort: { month: 1 } // Sort by month in ascending order
            }
        ]);

        // Ensure all 12 months are present, even if no budget for them
        const fullYearSummary = Array.from({ length: 12 }, (_, i) => {
            const monthNum = i + 1;
            const existingMonth = summary.find(item => item.month === monthNum);
            return existingMonth || { month: monthNum, totalAmount: 0, count: 0 };
        });

        return fullYearSummary;
    } catch (error) {
        handleAggregationError(error, 'getBudgetByMonthSummary');
    }
};
