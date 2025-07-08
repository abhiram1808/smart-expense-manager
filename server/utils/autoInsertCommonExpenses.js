// backend/utils/autoInsertCommonExpenses.js
import mongoose from 'mongoose';
import CommonExpense from '../models/CommonExpense.js'; // Path to your CommonExpense model
import Expense from '../models/Expense.js'; // Path to your Expense model
import 'dotenv/config'; // To ensure process.env.MONGO_URI is loaded

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'expenseDB'; // Your database name

/**
 * Automatically inserts recurring expenses based on active CommonExpense definitions.
 * This function is typically called by a cron job.
 */
export const autoInsertCommonExpenses = async () => { // <--- THIS IS THE CRITICAL NAMED EXPORT
    let connection;
    try {
        // Establish connection if not already connected (for standalone script execution)
        if (mongoose.connection.readyState !== 1) { // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
            connection = await mongoose.connect(MONGO_URI, {
                // useNewUrlParser: true, // Deprecated options removed
                // useUnifiedTopology: true, // Deprecated options removed
                dbName: DB_NAME
            });
            console.log('✅ MongoDB Connected for auto-inserting common expenses.');
        }

        const today = new Date();
        const currentMonth = today.getMonth() + 1; // 1-indexed
        const currentYear = today.getFullYear();
        const currentDay = today.getDate();

        console.log(`Auto-insert: Running for ${currentDay}/${currentMonth}/${currentYear}`);

        // Find active common expenses that are due today or have not been inserted this month
        const commonExpensesToInsert = await CommonExpense.find({
            isActive: true,
            dayOfMonth: currentDay, // Only insert if today is the specified dayOfMonth
            // Check if it hasn't been inserted this month/year yet
            $or: [
                { lastInsertedDate: { $eq: null } }, // Never inserted before
                {
                    lastInsertedDate: {
                        $lt: new Date(currentYear, currentMonth - 1, 1) // Last inserted date is before the start of the current month
                    }
                }
            ]
        });

        if (commonExpensesToInsert.length === 0) {
            console.log('ℹ️ No common expenses due for auto-insertion today or already inserted this month.');
            return;
        }

        console.log(`Found ${commonExpensesToInsert.length} common expenses to auto-insert.`);

        const insertedExpenses = [];
        for (const commonExpense of commonExpensesToInsert) {
            // Ensure the expense date is set to the current month/year, but the specific dayOfMonth from the common expense
            const expenseDate = new Date(currentYear, currentMonth - 1, commonExpense.dayOfMonth);

            // Create a new Expense record
            const newExpense = {
                category: commonExpense.category,
                amount: commonExpense.amount,
                date: expenseDate,
                month: currentMonth,
                year: currentYear,
                description: `Auto-inserted: ${commonExpense.name} (Recurring)`, // Add a description
                // user: commonExpense.user, // Uncomment if you have user IDs
            };

            const createdExpense = await Expense.create(newExpense);
            insertedExpenses.push(createdExpense);

            // Update the lastInsertedDate on the CommonExpense
            commonExpense.lastInsertedDate = today; // Set to today's date
            await commonExpense.save();

            console.log(`✅ Auto-inserted expense for '${commonExpense.name}' (ID: ${createdExpense._id})`);
        }

        console.log(`🎉 Successfully auto-inserted ${insertedExpenses.length} recurring expenses.`);

    } catch (error) {
        console.error('❌ Error during auto-insertion of common expenses:', error);
    } finally {
        // Only disconnect if this script initiated the connection (e.g., when run manually)
        // If run by index.js, the connection is managed by index.js
        if (connection) {
            await mongoose.disconnect();
            console.log('🔌 MongoDB Disconnected after auto-insertion.');
        }
    }
};

// This block allows the script to be run directly for testing,
// but prevents it from executing when simply imported by index.js
if (process.argv[1] === new URL(import.meta.url).pathname) {
    autoInsertCommonExpenses();
}
