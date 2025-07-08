// backend/seedExpense.js
import mongoose from 'mongoose';
import Expense from './models/Expense.js'; // Ensure this path points to your Expense model
import 'dotenv/config'; // Automatically loads environment variables from .env file

// Replace with your actual MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'expenseDB'; // Your database name, ensure it matches your index.js

// Define common expense categories (can be synced with your Category model if you have one)
const expenseCategories = [
    'Groceries', 'Rent', 'Utilities', 'Transport', 'Dining Out',
    'Entertainment', 'Shopping', 'Health', 'Education', 'Loan Payment',
    'Subscription', 'Insurance', 'Personal Care', 'Travel', 'Other'
];

// Helper to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to get a random amount within a range
const getRandomAmount = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

// Generate dummy expense data
const dummyExpenses = [];
const numExpensesToGenerate = 100; // Generate 100 random expenses

for (let i = 0; i < numExpensesToGenerate; i++) {
    const randomCategory = getRandomElement(expenseCategories);
    const randomAmount = getRandomAmount(50, 5000); // Amounts between 50 and 5000

    // Generate a random date within the last 12 months
    const today = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 365); // Up to 1 year ago
    const randomDate = new Date(today);
    randomDate.setDate(today.getDate() - randomDaysAgo);

    // --- CRITICAL FIX: Explicitly calculate month and year ---
    const expenseMonth = randomDate.getMonth() + 1; // getMonth() is 0-indexed
    const expenseYear = randomDate.getFullYear();
    // --- END CRITICAL FIX ---

    const descriptions = [
        `Purchased ${randomCategory} items`,
        `Paid for ${randomCategory}`,
        `Monthly ${randomCategory} expense`,
        `Miscellaneous ${randomCategory} cost`,
        `Bill for ${randomCategory} service`
    ];
    const randomDescription = getRandomElement(descriptions);

    dummyExpenses.push({
        category: randomCategory,
        amount: randomAmount,
        date: randomDate,
        description: randomDescription,
        month: expenseMonth, // <--- ADDED
        year: expenseYear,   // <--- ADDED
        createdAt: new Date(randomDate.getTime() + Math.random() * 86400000) // Slightly vary createdAt
    });
}

async function seedExpenses() {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: DB_NAME // Specify the database name
        });
        console.log('✅ MongoDB Connected for expense seeding!');

        // Clear existing expenses for a clean slate (optional, but good for testing)
        console.log('🗑️ Clearing existing expense data...');
        await Expense.deleteMany({});
        console.log('🗑️ Existing expense data cleared.');

        console.log(`Inserting ${dummyExpenses.length} expense records...`);
        await Expense.insertMany(dummyExpenses);
        console.log('🎉 Expense data seeded successfully!');

    } catch (error) {
        console.error('❌ Error seeding expense data:', error);
        if (error.name === 'ValidationError') {
            for (let field in error.errors) {
                console.error(`Validation Error for field '${field}': ${error.errors[field].message}`);
            }
        } else if (error.code === 11000) {
            console.error('Duplicate key error:', error.message);
        }
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB Disconnected.');
    }
}

// --- Execute the seeding function ---
seedExpenses()
    .then(() => console.log('Expense seeding process finished.'))
    .catch(err => console.error('Expense seeding process failed:', err));

// To run this script:
// 1. Make sure your backend server (index.js) is NOT running.
// 2. Open a terminal, navigate to your backend directory (e.g., F:/smart-expense-manager/server).
// 3. Type: node seedExpense.js
