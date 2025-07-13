// server/models/Expense.js
import mongoose from 'mongoose';

const expense = new mongoose.Schema({
  description: {
    type: String,
    required: false, // Description is optional
    default: '',  
    
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  month: {
    type: Number,
    min: 1,
    max: 12,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  // Fields for recurring expenses (if generated from a common expense template)
  isRecurring: { // Indicates if this expense was generated from a recurring template
    type: Boolean,
    default: false,
  },
  recurringTemplateId: { // Link to the CommonExpense template it was generated from
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommonExpense', // <--- UPDATED TO REFERENCE CommonExpense
  },
}, {
  timestamps: true,
});

expense.index({ date: 1, month: 1, year: 1, user: 1 });

export default mongoose.model('Expense', expense);
