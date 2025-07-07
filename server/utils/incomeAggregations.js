// backend/utils/incomeAggregations.js
import Income from '../models/Income.js'; // Ensure this path correctly points to your Income model

// Helper for consistent error handling and logging in aggregation functions
const handleAggregationError = (error, functionName) => {
    console.error(`❌ Error in ${functionName} aggregation:`, error);
    throw new Error(`Failed to perform ${functionName}: ${error.message}`);
};

/**
 * Fetches all income records, with optional filtering and sorting.
 * @param {object} filters - Object containing optional filters (e.g., { month, source, minAmount, maxAmount, year }).
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of income documents.
 */
export const getIncomes = async (filters = {}) => {
    try {
        const query = {};

        // Filter by source
        if (filters.source) {
            query.source = filters.source;
        }

        // Filter by amount range
        if (filters.minAmount || filters.maxAmount) {
            query.amount = {};
            if (filters.minAmount) query.amount.$gte = Number(filters.minAmount);
            if (filters.maxAmount) query.amount.$lte = Number(filters.maxAmount);
        }

        // Filter by year and/or month (using the 'date' field for robustness)
        if (filters.year) {
            const yearNum = Number(filters.year);
            const startDate = new Date(yearNum, 0, 1); // January 1st of the year
            const endDate = new Date(yearNum + 1, 0, 1); // January 1st of next year

            query.date = {
                $gte: startDate,
                $lt: endDate // Use $lt for next year's January 1st to include all of current year
            };

            if (filters.month) {
                const monthNum = Number(filters.month) - 1; // Date months are 0-indexed
                query.date.$gte = new Date(yearNum, monthNum, 1);
                query.date.$lt = new Date(yearNum, monthNum + 1, 1);
            }
        } else if (filters.month) {
            // If only month is provided without year, this might not be precise across years.
            // It's generally better to filter by year and month.
            console.warn("getIncomes: Filtering by month without year can lead to unexpected results across multiple years.");
            query.month = Number(filters.month); // Assuming 'month' field is stored directly
        }

        // Sort by date descending by default
        return await Income.find(query).sort({ date: -1 });
    } catch (error) {
        handleAggregationError(error, 'getIncomes');
    }
};


/**
 * Aggregates income by month for a given year.
 * Ensures all 12 months are present in the output, even if totalAmount is 0.
 *
 * @param {number} year - The year for which to aggregate data.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects,
 * each representing a month's summary with total amount and count.
 * Example: [{ month: 1, totalAmount: 1500, count: 5 }, ...]
 */
export const getIncomeByMonthSummary = async (year) => {
    try {
        if (!year || typeof year !== 'number') {
            throw new Error('A valid year (number) is required for monthly income summary.');
        }

        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        const summary = await Income.aggregate([
            {
                $match: {
                    date: { // Using 'date' field from your Income model
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$date' }, // Group by month number (1-12)
                    totalAmount: { $sum: '$amount' }, // Assuming 'amount' field for sum
                    count: { $sum: 1 }
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

        // Ensure all 12 months are present, even if no income for them
        const fullYearSummary = Array.from({ length: 12 }, (_, i) => {
            const monthNum = i + 1;
            const existingMonth = summary.find(item => item.month === monthNum);
            return existingMonth || { month: monthNum, totalAmount: 0, count: 0 };
        });

        return fullYearSummary;
    } catch (error) {
        handleAggregationError(error, 'getIncomeByMonthSummary');
    }
};

/**
 * Aggregates income by source for a given year.
 * This is perfect for a Pie Chart showing income distribution.
 *
 * @param {number} year - The year for which to aggregate data.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects,
 * each representing a source's total income.
 * Example: [{ source: 'Salary', totalAmount: 50000 }, { source: 'Freelance', totalAmount: 10000 }]
 */
export const getIncomeSummaryBySource = async (year) => {
    try {
        if (!year || typeof year !== 'number') {
            throw new Error('A valid year (number) is required for income summary by source.');
        }

        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        const summary = await Income.aggregate([
            {
                $match: {
                    date: { // Filter by date within the specified year
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: '$source', // Group by the 'source' field
                    totalAmount: { $sum: '$amount' }, // Sum the 'amount' for each source
                    count: { $sum: 1 } // Count documents per source
                }
            },
            {
                $project: {
                    source: '$_id', // Rename _id to source
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
        handleAggregationError(error, 'getIncomeSummaryBySource');
    }
};


/**
 * Aggregates income and groups them by month and year, including individual items.
 * This is designed to support the grouped list view on the frontend.
 *
 * @param {number} year - The year for which to aggregate data.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of grouped income objects.
 * Each group includes a label, total amount for the month, and an array of individual income items.
 * Example: [{ key: '2025-06', label: 'June 2025', date: DateObject, total: 1500, items: [...] }, ...]
 */
export const getIncomeGroupedByMonth = async (year) => {
    try {
        if (!year || typeof year !== 'number') {
            throw new Error('A valid year (number) is required for grouped incomes.');
        }

        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        const groupedIncomes = await Income.aggregate([
            {
                $match: {
                    date: { // Using 'date' field from your Income model
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $addFields: {
                    incomeYear: { $year: '$date' },
                    incomeMonth: { $month: '$date' } // 1-12
                }
            },
            {
                $group: {
                    _id: {
                        year: '$incomeYear',
                        month: '$incomeMonth'
                    },
                    total: { $sum: '$amount' }, // Summing on 'amount' field
                    items: { $push: '$$ROOT' } // Push the entire income document into 'items' array
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
                    items: 1 // Include the array of individual income items
                }
            },
            {
                $sort: { date: -1 } // Sort groups by date descending (most recent month first)
            }
        ]);

        return groupedIncomes;
    } catch (error) {
        handleAggregationError(error, 'getIncomeGroupedByMonth');
    }
};

/**
 * Aggregates income by source, month, and year.
 * This is perfect for a grouped bar chart showing income from each source per month.
 *
 * @param {number} year - The year for which to aggregate data.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects,
 * each representing a month and source's total income.
 * Example: [{ year: 2025, month: 1, source: 'Salary', totalAmount: 50000 }, ...]
 */
export const getIncomeBySourceMonthly = async (year) => { // NEW AGGREGATION
    try {
        if (!year || typeof year !== 'number') {
            throw new Error('A valid year (number) is required for income by source monthly summary.');
        }

        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        const summary = await Income.aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
                        source: '$source'
                    },
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id.month',
                    source: '$_id.source',
                    totalAmount: 1
                }
            },
            {
                $sort: { month: 1, source: 1 } // Sort by month, then by source
            }
        ]);
        return summary;
    } catch (error) {
        handleAggregationError(error, 'getIncomeBySourceMonthly');
    }
};


// You can keep other specific query functions here if they are used directly in routes or other parts of your backend.
// Example:
export const getIncomeByDateRange = async (start, end) => {
    try {
        return await Income.find({
            date: { $gte: new Date(start), $lte: new Date(end) }
        }).sort({ date: -1 });
    } catch (error) {
        handleAggregationError(error, 'getIncomeByDateRange');
    }
};

export const getIncomeBySourceAndMonth = async (source, month) => {
    try {
        // Assuming 'month' is stored as a number in your schema (1-12)
        return await Income.find({ source, month: Number(month) }).sort({ date: -1 });
    } catch (error) {
        handleAggregationError(error, 'getIncomeBySourceAndMonth');
    }
};

export const getIncomeByAmountRangeAndMonth = async (minAmount, maxAmount, month) => {
    try {
        const query = { month: Number(month) };
        query.amount = {};
        if (minAmount) query.amount.$gte = Number(minAmount);
        if (maxAmount) query.amount.$lte = Number(maxAmount);
        return await Income.find(query).sort({ date: -1 });
    } catch (error) {
        handleAggregationError(error, 'getIncomeByAmountRangeAndMonth');
    }
};
