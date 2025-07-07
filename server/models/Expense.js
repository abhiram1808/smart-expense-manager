// models/Expense.js
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  isRecurring: { type: Boolean, default: false },
  year: Number, // Assuming this is for convenience, but 'date' is primary
  month: Number, // Assuming this is for convenience, but 'date' is primary
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Expense', expenseSchema);