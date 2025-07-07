// seedCommonExpenses.js
// Script to seed two years of common recurring expenses for analytics and summarization
import mongoose from 'mongoose';
import CommonExpense from './models/CommonExpense.js';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI;

// Helper to generate YYYY-MM strings for the last 24 months
function getLast24Months() {
  const result = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.toISOString().slice(0, 7); // YYYY-MM
    result.unshift(month);
  }
  return result;
}

// Common recurring expense categories
const categories = [
  'Rent', 'Home Loan EMI', 'Car Loan EMI', 'Bike Loan EMI', 'Personal Loan EMI',
  'Tuition Fees', 'SIP/Investments', 'Insurance Premiums', 'Gym Membership',
  'Streaming Services', 'Mobile Recharge', 'Internet/Broadband', 'DTH Subscription',
  'Tuition Coaching', 'Coworking Rent', 'Loan to Friend'
];

const dummyCommonExpenses = [];
const monthsArr = getLast24Months();

categories.forEach(category => {
  // Each common expense starts at a random month in the last 24 months
  const startIdx = Math.floor(Math.random() * 12); // Start in the first year
  const startMonth = monthsArr[startIdx];
  const startDate = new Date(`${startMonth}-01T12:00:00.000Z`);
  // Duration: 6-24 months, but not exceeding the available months
  const maxDuration = 24 - startIdx;
  const duration = Math.floor(Math.random() * (maxDuration - 6 + 1)) + 6;
  // Amount logic (similar to budget)
  let amount;
  switch (category) {
    case 'Rent':
    case 'Home Loan EMI':
    case 'Car Loan EMI':
    case 'Bike Loan EMI':
    case 'Personal Loan EMI':
    case 'Coworking Rent':
      amount = 18000;
      break;
    case 'Tuition Fees':
    case 'Tuition Coaching':
      amount = 4000;
      break;
    case 'SIP/Investments':
      amount = 5000;
      break;
    case 'Insurance Premiums':
      amount = 2500;
      break;
    case 'Gym Membership':
      amount = 1200;
      break;
    case 'Streaming Services':
      amount = 600;
      break;
    case 'Mobile Recharge':
      amount = 500;
      break;
    case 'Internet/Broadband':
      amount = 1000;
      break;
    case 'DTH Subscription':
      amount = 400;
      break;
    case 'Loan to Friend':
      amount = 2000;
      break;
    default:
      amount = 3000;
  }
  dummyCommonExpenses.push({
    category,
    amount,
    startDate,
    duration,
    isActive: (startIdx + duration >= 24), // Active if still ongoing in the latest month
    createdAt: startDate
  });
});

async function seed() {
  await mongoose.connect(MONGO_URI);
  await CommonExpense.deleteMany({}); // Optional: clear existing data
  await CommonExpense.insertMany(dummyCommonExpenses);
  console.log('Seeded common recurring expenses for two years.');
  await mongoose.disconnect();
}

seed().catch(console.error);
