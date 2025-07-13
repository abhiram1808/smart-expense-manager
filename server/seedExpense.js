// server/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Expense from './models/Expense.js';
import Income from './models/Income.js';
import Budget from './models/Budget.js';
import CommonExpense from './models/CommonExpense.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Category.deleteMany();
    await Expense.deleteMany();
    await Income.deleteMany();
    await Budget.deleteMany();
    await CommonExpense.deleteMany();
    console.log('Existing data cleared.');

    // --- Categories ---
    const categories = [
      { name: 'Food', type: 'expense' },
      { name: 'Transport', type: 'expense' },
      { name: 'Utilities', type: 'expense' },
      { name: 'Rent', type: 'expense' },
      { name: 'Salary', type: 'income' },
      { name: 'Freelance', type: 'income' },
      { name: 'Groceries', type: 'expense' },
      { name: 'Entertainment', type: 'expense' },
      { name: 'Health', type: 'expense' },
      { name: 'Savings', type: 'budget' }, // Added for budget categories
      { name: 'Education', type: 'expense' },
      { name: 'Shopping', type: 'expense' },
      { name: 'Investments', type: 'income' },
      { name: 'Gifts', type: 'expense' },
      { name: 'Travel', type: 'expense' },
      { name: 'Housing', type: 'expense' }, // From your seed
      { name: 'Transportation', type: 'expense' }, // From your seed
      { name: 'Communication', type: 'expense' }, // From your seed
      { name: 'Insurance', type: 'expense' }, // From your seed
      { name: 'Software', type: 'expense' }, // From your seed
      { name: 'Miscellaneous', type: 'expense' }, // From your seed
    ];
    await Category.insertMany(categories);
    console.log('Categories seeded.');

    // --- Expenses ---
    const expenses = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed

    // Add some expenses for the current month and year (July 2025)
    expenses.push(
      { description: 'Coffee', amount: 150, category: 'Food', date: new Date(currentYear, currentMonth - 1, today.getDate()), month: currentMonth, year: currentYear },
      { description: 'Bus fare', amount: 50, category: 'Transport', date: new Date(currentYear, currentMonth - 1, today.getDate()), month: currentMonth, year: currentYear },
      { description: 'Lunch with colleagues', amount: 300, category: 'Food', date: new Date(currentYear, currentMonth - 1, today.getDate() - 1), month: currentMonth, year: currentYear },
      { description: 'Electricity Bill', amount: 1200, category: 'Utilities', date: new Date(currentYear, currentMonth - 1, 5), month: currentMonth, year: currentYear },
      { description: 'Movie tickets', amount: 400, category: 'Entertainment', date: new Date(currentYear, currentMonth - 1, 10), month: currentMonth, year: currentYear },
      { description: 'Internet Bill', amount: 800, category: 'Utilities', date: new Date(currentYear, currentMonth - 1, 1), month: currentMonth, year: currentYear },
      { description: 'Dinner out', amount: 850, category: 'Food', date: new Date(currentYear, currentMonth - 1, today.getDate() - 2), month: currentMonth, year: currentYear },
      { description: 'New book', amount: 600, category: 'Entertainment', date: new Date(currentYear, currentMonth - 1, today.getDate() - 3), month: currentMonth, year: currentYear },
      { description: 'Cab ride', amount: 250, category: 'Transport', date: new Date(currentYear, currentMonth - 1, today.getDate() - 4), month: currentMonth, year: currentYear },
      { description: 'Monthly groceries', amount: 4500, category: 'Groceries', date: new Date(currentYear, currentMonth - 1, 1), month: currentMonth, year: currentYear },
    );

    // Add some expenses for previous months/years for history testing
    expenses.push(
      { description: 'Old Groceries', amount: 750, category: 'Groceries', date: new Date(currentYear, currentMonth - 2, 15), month: currentMonth - 1, year: currentYear }, // Last month
      { description: 'Old Rent', amount: 15000, category: 'Rent', date: new Date(currentYear - 1, 11, 1), month: 12, year: currentYear - 1 }, // Last year, Dec
      { description: 'Old Travel', amount: 5000, category: 'Travel', date: new Date(currentYear - 1, 6, 20), month: 7, year: currentYear - 1 }, // Last year, July
      { description: 'Previous Year Food', amount: 1000, category: 'Food', date: new Date(currentYear - 1, currentMonth - 1, 1), month: currentMonth, year: currentYear - 1 }, // Same month, previous year
      { description: 'Another Old Utility', amount: 900, category: 'Utilities', date: new Date(currentYear, currentMonth - 3, 10), month: currentMonth - 2, year: currentYear }, // Two months ago
    );
    await Expense.insertMany(expenses);
    console.log('Expenses seeded.');

    // --- Incomes ---
    const incomes = [];
    incomes.push(
      { description: 'Monthly Salary', amount: 50000, category: 'Salary', date: new Date(currentYear, currentMonth - 1, 1), month: currentMonth, year: currentYear },
      { description: 'Freelance Project', amount: 15000, category: 'Freelance', date: new Date(currentYear, currentMonth - 1, 10), month: currentMonth, year: currentYear },
      { description: 'Bonus', amount: 5000, category: 'Salary', date: new Date(currentYear - 1, 11, 20), month: 12, year: currentYear - 1 },
      { description: 'Investment Returns', amount: 2500, category: 'Investments', date: new Date(currentYear, currentMonth - 2, 5), month: currentMonth - 1, year: currentYear },
    );
    await Income.insertMany(incomes);
    console.log('Incomes seeded.');

    // --- Budgets ---
    const budgets = [];
    budgets.push(
      { category: 'Food', amount: 10000, month: currentMonth, year: currentYear },
      { category: 'Transport', amount: 2000, month: currentMonth, year: currentYear },
      { category: 'Utilities', amount: 3000, month: currentMonth, year: currentYear },
      { category: 'Entertainment', amount: 5000, month: currentMonth, year: currentYear },
      { category: 'Groceries', amount: 7000, month: currentMonth, year: currentYear },
      { category: 'Health', amount: 4000, month: currentMonth, year: currentYear },
      { category: 'Food', amount: 9000, month: currentMonth - 1, year: currentYear }, // Budget for last month
      { category: 'Rent', amount: 18000, month: currentMonth, year: currentYear },
    );
    await Budget.insertMany(budgets);
    console.log('Budgets seeded.');

    // --- Common Expenses (Recurring Templates) ---
    const commonExpenses = [];
    commonExpenses.push(
      { name: 'Monthly Rent', category: 'Rent', amount: 18000, dayOfMonth: 1, startDate: new Date(2024, 0, 1), isActive: true },
      { name: 'Electricity Bill', category: 'Utilities', amount: 3500, dayOfMonth: 10, startDate: new Date(2024, 2, 1), isActive: true },
      { name: 'Internet Bill', category: 'Utilities', amount: 999, dayOfMonth: 20, startDate: new Date(2024, 4, 1), isActive: true },
      { name: 'Gym Membership', category: 'Health', amount: 1500, dayOfMonth: 5, startDate: new Date(2024, 5, 1), termMonths: 12, isActive: true },
      { name: 'Car Loan EMI', category: 'Transport', amount: 8500, dayOfMonth: 25, startDate: new Date(2024, 6, 1), termMonths: 60, isActive: true },
      { name: 'Netflix Subscription', category: 'Entertainment', amount: 499, dayOfMonth: 15, startDate: new Date(2024, 7, 1), isActive: true },
      { name: 'Groceries (Recurring)', category: 'Food', amount: 6000, dayOfMonth: 2, startDate: new Date(2024, 8, 1), isActive: true },
      { name: 'Water Bill', category: 'Utilities', amount: 800, dayOfMonth: 28, startDate: new Date(2024, 9, 1), isActive: true },
      { name: 'Mobile Bill', category: 'Communication', amount: 599, dayOfMonth: 7, startDate: new Date(2024, 10, 1), isActive: true },
      { name: 'School Fees', category: 'Education', amount: 12000, dayOfMonth: 1, startDate: new Date(2025, 0, 1), termMonths: 9, isActive: true },
      { name: 'Insurance Premium', category: 'Insurance', amount: 2500, dayOfMonth: 18, startDate: new Date(2025, 1, 1), termMonths: 12, isActive: true },
      { name: 'Software Subscription', category: 'Software', amount: 750, dayOfMonth: 3, startDate: new Date(2025, 2, 1), isActive: true },
      { name: 'Old Template (Paused)', category: 'Miscellaneous', amount: 1000, dayOfMonth: 1, startDate: new Date(2024, 0, 1), isActive: false },
      { name: 'Expired Template', category: 'Miscellaneous', amount: 500, dayOfMonth: 1, startDate: new Date(2024, 0, 1), endDate: new Date(2024, 1, 1), isActive: true },
      { name: 'Future Template', category: 'Savings', amount: 2000, dayOfMonth: 1, startDate: new Date(2026, 0, 1), isActive: true },
    );
    await CommonExpense.insertMany(commonExpenses);
    console.log(`Successfully inserted ${commonExpenses.length} common expense templates.`);


    console.log('Data seeding complete!');
    mongoose.connection.close();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
