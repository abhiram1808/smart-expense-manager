// backend/seedBudget.js (Updated for Dynamic Monthly Data)
import mongoose from 'mongoose';
import Budget from './models/Budget.js'; // Ensure this path points to your Budget model
import 'dotenv/config'; // Automatically loads environment variables from .env file

// Replace with your actual MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'expenseDB'; // Your database name, ensure it matches your index.js

// Helper to generate month/year info for the last 24 months (current year + last year)
function getLast24MonthsData() {
    const result = [];
    const now = new Date();
    // Loop for 24 months (current month + 23 previous months)
    for (let i = 0; i < 24; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.unshift({ // Add to the beginning to keep chronological order
            year: d.getFullYear(),
            monthNum: d.getMonth() + 1, // 1-indexed month
        });
    }
    return result;
}

// Define common categories for which to set budgets
const budgetCategories = [
    'Groceries',
    'Utilities',
    'Rent',
    'Transport',
    'Entertainment',
    'Dining Out',
    'Shopping',
    'Health',
    'Education',
    'Travel',
    'Bills',
    'Other'
];

// Define base amounts for categories to make them somewhat realistic
const baseBudgetAmounts = {
    'Groceries': 8000,
    'Utilities': 3500,
    'Rent': 15000,
    'Transport': 3500,
    'Entertainment': 3000,
    'Dining Out': 2000,
    'Shopping': 5000,
    'Health': 1000,
    'Education': 8000,
    'Travel': 10000,
    'Bills': 3000,
    'Other': 1000
};

// Generate dummy budget data
const monthsData = getLast24MonthsData();
const dummyBudgets = [];

monthsData.forEach((monthInfo) => {
    budgetCategories.forEach(category => {
        let baseAmount = baseBudgetAmounts[category] || 1000; // Fallback if category not in map

        // Introduce monthly fluctuation (e.g., +/- 10% of base amount)
        const monthlyFluctuation = (Math.random() * 0.2 - 0.1) * baseAmount; // Random between -10% and +10%

        // Introduce a subtle yearly adjustment (e.g., 2% increase per year)
        // Adjust this based on the actual starting year of your data if different from currentYear - 1
        const currentYear = new Date().getFullYear();
        const yearIndex = monthInfo.year - (currentYear - 1); // 0 for last year, 1 for current year
        const yearlyAdjustment = baseAmount * 0.02 * Math.max(0, yearIndex); // 2% increase per year after the first year

        let finalAmount = baseAmount + monthlyFluctuation + yearlyAdjustment;
        finalAmount = Math.max(100, finalAmount); // Ensure amount is at least 100 to avoid zero or negative budgets

        dummyBudgets.push({
            category,
            amount: parseFloat(finalAmount.toFixed(2)), // Ensure amount is a float with 2 decimal places
            month: monthInfo.monthNum, // 1-indexed month
            year: monthInfo.year,
            createdAt: new Date() // Set createdAt to current time of seeding
        });
    });
});

async function seedBudgets() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: DB_NAME // Specify the database name
        });
        console.log('✅ MongoDB Connected for budget seeding!');

        // Clear existing budgets for a clean slate (optional)
        console.log('🗑️ Clearing existing budget data...');
        await Budget.deleteMany({});
        console.log('🗑️ Existing budget data cleared.');

        console.log(`Inserting ${dummyBudgets.length} budget records...`);
        await Budget.insertMany(dummyBudgets);
        console.log('🎉 Budget data seeded successfully!');

    } catch (error) {
        console.error('❌ Error seeding budget data:', error);
        if (error.name === 'ValidationError') {
            for (let field in error.errors) {
                console.error(`Validation Error for field '${field}': ${error.errors[field].message}`);
            }
        } else if (error.code === 11000) { // Duplicate key error
             console.error('Duplicate key error: A budget for this category, month, and year might already exist.');
        }
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB Disconnected.');
    }
}

// --- Execute the seeding function ---
seedBudgets()
    .then(() => console.log('Budget seeding process finished.'))
    .catch(err => console.error('Budget seeding process failed:', err));

// To run this script:
// 1. Make sure your backend server (index.js) is NOT running.
// 2. Open a terminal, navigate to your backend directory (e.g., F:/smart-expense-manager/server).
// 3. Type: node seedBudget.js
