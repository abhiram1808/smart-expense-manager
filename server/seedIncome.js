// backend/seedIncome.js (Fixed Version)
import mongoose from 'mongoose';
import Income from './models/Income.js';
import 'dotenv/config'; // Automatically loads environment variables from .env file

// Replace with your actual MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'expenseDB'; // Ensure this matches your main DB name - UPDATED HERE

// Helper to generate YYYY-MM strings for the last 24 months (current year + last year)
// This function will now also return the month number and year number
function getLast24MonthsData() {
    const result = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.unshift({
            year: d.getFullYear(),
            monthNum: d.getMonth() + 1, // 1-indexed month
            isoMonth: d.toISOString().slice(0, 7) // YYYY-MM string
        });
    }
    return result;
}

// Define 6 common sources that appear every month
const commonSources = [
    'Salary',
    'Freelance',
    'Consulting',
    'Interest',
    'Bonus',
    'Rental',
    'Other',
];

// Generate dummy income for each month and 6 common sources for 2 years
const monthsData = getLast24MonthsData(); // Get structured month data
const dummyIncome = [];

monthsData.forEach((monthInfo) => { // Iterate through structured month data
    commonSources.forEach(source => {
        // Custom amount logic for realism
        let amount;
        switch (source) {
            case 'Salary':
                // Simulate a small annual raise every 12 months (based on monthInfo.year)
                const baseSalary = 40000;
                // Calculate raise based on how many full years have passed since SEED_START_YEAR
                const yearsPassed = monthInfo.year - (new Date().getFullYear() - 1); // Assuming SEED_START_YEAR is 2024 for 2 years back
                const raise = Math.max(0, yearsPassed) * 3000; // +3k for each full year passed
                const fluctuation = Math.floor(Math.random() * 2000) - 1000; // ±1000
                amount = baseSalary + raise + fluctuation;
                break;
            case 'Bonus':
                amount = Math.floor(Math.random() * 20000) + 5000;
                break;
            case 'Rental':
                amount = Math.floor(Math.random() * 10000) + 3000;
                break;
            case 'Freelance':
            case 'Consulting':
                amount = Math.floor(Math.random() * 15000) + 2000;
                break;
            case 'Interest':
                amount = Math.floor(Math.random() * 3000) + 500;
                break;
            default:
                amount = Math.floor(Math.random() * 10000) + 1000;
        }

        // Set date to a random day in the month
        const day = Math.floor(Math.random() * 28) + 1; // Max 28 to avoid issues with Feb
        const incomeDate = new Date(monthInfo.year, monthInfo.monthNum - 1, day, 12, 0, 0, 0); // Year, 0-indexed month, day, 12 PM UTC

        dummyIncome.push({
            amount: parseFloat(amount.toFixed(2)), // Ensure amount is a float with 2 decimal places
            source,
            date: incomeDate, // CRITICAL: Set the 'date' field as a Date object
            year: monthInfo.year, // CRITICAL: Set the 'year' as a Number
            month: monthInfo.monthNum, // CRITICAL: Set the 'month' as a Number (1-12)
            createdAt: new Date() // Set createdAt to current time of seeding, or incomeDate if preferred
        });
    });
});

async function seed() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: DB_NAME // Specify the database name here
        });
        console.log('✅ MongoDB Connected for seeding!');

        await Income.deleteMany({}); // Optional: clear existing data
        console.log('🗑️ Cleared existing income data.');

        console.log(`Inserting ${dummyIncome.length} income records...`);
        await Income.insertMany(dummyIncome);
        console.log('🎉 Income data seeded successfully!');

    } catch (error) {
        console.error('❌ Error seeding income data:', error);
        // Log the specific validation errors
        if (error.name === 'ValidationError') {
            for (let field in error.errors) {
                console.error(`Validation Error for field '${field}': ${error.errors[field].message}`);
            }
        }
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB Disconnected.');
    }
}

seed().catch(console.error);

// To run this script:
// 1. Make sure your backend server (index.js) is NOT running (to avoid conflicts with DB connection).
// 2. Open a terminal, navigate to your backend directory.
// 3. Type: node seedIncome.js
