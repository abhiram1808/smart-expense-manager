// models/CommonExpense.js
import mongoose from 'mongoose';

const commonExpenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  duration: { type: Number }, // in months
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('CommonExpense', commonExpenseSchema);
