// seedCategories.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

dotenv.config(); // load your MongoDB URI from .env

const predefinedCategories = [
  'Rent',
  'Travel',
  'Groceries',
  'EMI',
  'Utilities',
  'Health',
  'Entertainment',
  'Education',
  'Investment',
  'Subscriptions',
  'Insurance',
  'Fuel',
  'Savings',
  'Other'
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const name of predefinedCategories) {
      const exists = await Category.findOne({ name });
      if (!exists) {
        await Category.create({ name });
        console.log(`✅ Category added: ${name}`);
      } else {
        console.log(`🔁 Already exists: ${name}`);
      }
    }

    console.log('🎉 Category seeding completed.');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding categories:', err);
    process.exit(1);
  }
};

seedCategories();
