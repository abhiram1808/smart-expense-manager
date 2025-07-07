// backend/seed.js (Refined Version)
import mongoose from 'mongoose';

import Expense from './models/Expense.js'; // Adjust path if your models folder is elsewhere


// Script to seed one year of income data for analytics and summarization

import 'dotenv/config'; // Automatically loads environment variables from .env file


// Replace with your actual MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;

// --- Configuration ---
const SEED_START_YEAR = 2024; // Start seeding from this year
const SEED_END_YEAR = new Date().getFullYear(); // Seed up to the current year
const CURRENT_MONTH = new Date().getMonth() + 1; // Current month (1-indexed)
const CURRENT_DAY = new Date().getDate(); // Current day of the month

// --- Sample Data Templates ---
const commonExpensesTemplates = [
    { category: 'Rent', amount: 15000, isRecurring: true, dayOfMonth: 1 },
    { category: 'Internet Bill', amount: 800, isRecurring: true, dayOfMonth: 5 },
    { category: 'Electricity Bill', amount: 1200, isRecurring: true, dayOfMonth: 10 },
    { category: 'Netflix Subscription', amount: 499, isRecurring: true, dayOfMonth: 15 },
    { category: 'Gym Membership', amount: 1000, isRecurring: true, dayOfMonth: 20 },
    { category: 'Phone Bill', amount: 650, isRecurring: true, dayOfMonth: 25 },
];

const categoriesForRandomExpenses = [
    'Groceries', 'Dining Out', 'Transport', 'Shopping', 'Entertainment', 'Healthcare',
    'Education', 'Travel', 'Hobbies', 'Personal Care', 'Home Maintenance'
];

// --- Helper Functions ---
const getRandomAmount = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const getRandomCategory = () => categoriesForRandomExpenses[Math.floor(Math.random() * categoriesForRandomExpenses.length)];

/**
 * Seeds the database with expense data.
 * It clears existing expenses first and generates data based on current date.
 */
const seedExpenses = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        });
        console.log('✅ MongoDB Connected for seeding!');

        // Clear existing expenses for a clean slate
        console.log('🗑️ Clearing existing expense data...');
        await Expense.deleteMany({});
        console.log('🗑️ Existing expense data cleared.');

        const expensesToInsert = [];

        for (let year = SEED_START_YEAR; year <= SEED_END_YEAR; year++) {
            const startMonth = 1;
            const endMonth = (year === SEED_END_YEAR) ? CURRENT_MONTH : 12;

            for (let monthNum = startMonth; monthNum <= endMonth; monthNum++) {
                // Determine the last day to seed for the current month in the current year
                const lastDayOfMonth = (year === SEED_END_YEAR && monthNum === CURRENT_MONTH) ? CURRENT_DAY : new Date(year, monthNum, 0).getDate();

                // 1. Insert Common (Recurring) Expenses
                for (const template of commonExpensesTemplates) {
                    // Only insert if the day of month for recurring expense is not in the future for current month
                    if (year === SEED_END_YEAR && monthNum === CURRENT_MONTH && template.dayOfMonth > CURRENT_DAY) {
                        continue; // Skip if recurring expense day is in the future for the current month
                    }
                    const date = new Date(year, monthNum - 1, template.dayOfMonth); // monthNum - 1 because Date months are 0-indexed
                    expensesToInsert.push({
                        category: template.category,
                        amount: template.amount,
                        date: date,
                        isRecurring: template.isRecurring,
                        year: year,
                        month: monthNum,
                        createdAt: date // Using the expense date for createdAt for seeding consistency
                    });
                }

                // 2. Insert Random Non-Recurring Expenses
                const numRandomExpenses = Math.floor(Math.random() * 3) + 2; // 2-4 random expenses per month
                for (let i = 0; i < numRandomExpenses; i++) {
                    let randomDay = Math.floor(Math.random() * lastDayOfMonth) + 1; // Random day within valid range for the month
                    const date = new Date(year, monthNum - 1, randomDay);

                    expensesToInsert.push({
                        category: getRandomCategory(),
                        amount: getRandomAmount(50, 5000),
                        date: date,
                        isRecurring: false,
                        year: year,
                        month: monthNum,
                        createdAt: date
                    });
                }
            }
        }

        console.log(`Inserting ${expensesToInsert.length} expense records...`);
        await Expense.insertMany(expensesToInsert);
        console.log('🎉 Expense data seeded successfully!');

    } catch (error) {
        console.error('❌ Error seeding expense data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB Disconnected.');
    }
};

// --- Execute the seeding function ---
seedExpenses()
    .then(() => console.log('Seeding process finished.'))
    .catch(err => console.error('Seeding process failed:', err));

// To run this script:
// 1. Make sure your backend server (index.js) is NOT running (to avoid conflicts with DB connection).
// 2. Open a terminal, navigate to your backend directory.
// 3. Type: node seed.js
