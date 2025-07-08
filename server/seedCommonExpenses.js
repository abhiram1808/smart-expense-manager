// backend/seedCommonExpense.js
import mongoose from 'mongoose';
import CommonExpense from './models/CommonExpense.js'; // Ensure this path points to your CommonExpense model
import 'dotenv/config'; // Automatically loads environment variables from .env file

// Replace with your actual MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'expenseDB'; // Your database name, ensure it matches your index.js

// Define common expense categories (reusing from other seeds)
const expenseCategories = [
    'Rent', 'Utilities', 'Internet', 'Phone Bill', 'Loan Payment',
    'Subscription', 'Insurance', 'Groceries', 'Transport', 'Gym Membership', 'Childcare', 'Pet Care', 'Other'
];

// Helper to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to get a random amount within a range
const getRandomAmount = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

// Generate dummy common expense data
const dummyCommonExpenses = [];

// Example recurring expenses definitions
// Added 'term' field for some to simulate fixed-term expenses
const commonExpenseDefinitions = [
    { name: 'Monthly Rent', category: 'Rent', baseAmount: 25000, day: 1, isActive: true, term: null },
    { name: 'Electricity Bill', category: 'Utilities', baseAmount: 1500, day: 10, isActive: true, term: null },
    { name: 'Internet Bill', category: 'Internet', baseAmount: 800, day: 5, isActive: true, term: null },
    { name: 'Mobile Bill (12m)', category: 'Phone Bill', baseAmount: 500, day: 20, isActive: true, term: 12 }, // Fixed term
    { name: 'Car Loan EMI (60m)', category: 'Loan Payment', baseAmount: 7500, day: 15, isActive: true, term: 60 }, // Fixed term
    { name: 'Netflix Subscription', category: 'Subscription', baseAmount: 500, day: 3, isActive: true, term: null },
    { name: 'Health Insurance', category: 'Insurance', baseAmount: 2000, day: 25, isActive: true, term: null },
    { name: 'Gym Fee (6m)', category: 'Gym Membership', baseAmount: 1200, day: 2, isActive: true, term: 6 }, // Fixed term
    { name: 'Childcare Fees', category: 'Childcare', baseAmount: 10000, day: 7, isActive: true, term: null },
    { name: 'Pet Food Subscription (3m)', category: 'Pet Care', baseAmount: 700, day: 18, isActive: true, term: 3 }, // Fixed term
    { name: 'Water Bill', category: 'Utilities', baseAmount: 300, day: 28, isActive: true, term: null },
    { name: 'Old Gym Membership (Inactive)', category: 'Gym Membership', baseAmount: 1000, day: 1, isActive: false, term: null }, // Inactive one
    { name: 'Magazine Subscription (24m)', category: 'Subscription', baseAmount: 200, day: 12, isActive: false, term: 24 }, // Inactive, fixed term
];

const now = new Date();
const currentMonth = now.getMonth(); // 0-indexed
const currentYear = now.getFullYear();

commonExpenseDefinitions.forEach(def => {
    const amount = getRandomAmount(def.baseAmount * 0.9, def.baseAmount * 1.1);
    
    // Set startDate to a random date in the past 1-12 months, or current month
    const startMonthOffset = Math.floor(Math.random() * 12); // 0 to 11 months ago
    const startDate = new Date(currentYear, currentMonth - startMonthOffset, def.day);
    startDate.setHours(0, 0, 0, 0); // Normalize to start of day

    let endDate = null;
    let termMonths = def.term; // Use the defined term

    // If a term is defined, calculate endDate from it.
    if (termMonths !== null) {
        endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + termMonths);
        endDate.setDate(startDate.getDate()); // Keep the same day of month
        endDate.setHours(0, 0, 0, 0); // Normalize to start of day
    } else if (Math.random() > 0.85) { // Small chance for an indefinite one to have an arbitrary future end date
        endDate = new Date(currentYear, currentMonth + Math.floor(Math.random() * 12) + 1, def.day); // 1 to 12 months in future
        endDate.setHours(0, 0, 0, 0); // Normalize to start of day
    }

    // Simulate lastInsertedDate:
    let lastInsertedDate = null;
    if (def.isActive) {
        const randomChance = Math.random();
        if (randomChance < 0.3) { // 30% chance to have been inserted last month
            lastInsertedDate = new Date(currentYear, currentMonth - 1, def.day);
        } else if (randomChance < 0.6) { // 30% chance to have been inserted current month (if day is past)
            if (def.day <= now.getDate()) {
                lastInsertedDate = new Date(currentYear, currentMonth, def.day);
            }
        }
    }


    dummyCommonExpenses.push({
        name: def.name,
        category: def.category,
        amount: amount,
        dayOfMonth: def.day,
        startDate: startDate,
        endDate: endDate, // This will be set by the seed script based on term or random
        termMonths: termMonths, // Store the termMonths value
        isActive: def.isActive,
        lastInsertedDate: lastInsertedDate,
        createdAt: new Date()
    });
});

async function seedCommonExpenses() {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: DB_NAME // Specify the database name
        });
        console.log('✅ MongoDB Connected for common expense seeding!');

        // Clear existing common expenses for a clean slate (optional)
        console.log('🗑️ Clearing existing common expense data...');
        await CommonExpense.deleteMany({});
        console.log('🗑️ Existing common expense data cleared.');

        console.log(`Inserting ${dummyCommonExpenses.length} common expense records...`);
        await CommonExpense.insertMany(dummyCommonExpenses);
        console.log('🎉 Common expense data seeded successfully!');

    } catch (error) {
        console.error('❌ Error seeding common expense data:', error);
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
seedCommonExpenses()
    .then(() => console.log('Common expense seeding process finished.'))
    .catch(err => console.error('Common expense seeding process failed:', err));

// To run this script:
// 1. Make sure your backend server (index.js) is NOT running.
// 2. Open a terminal, navigate to your backend directory (e.g., F:/smart-expense-manager/server).
// 3. Type: node seedCommonExpense.js
