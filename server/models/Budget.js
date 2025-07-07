// backend/models/Budget.js
import mongoose from 'mongoose';

const budgetSchema = mongoose.Schema(
    {
        category: {
            type: String,
            required: [true, 'Budget category is required'],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, 'Budget amount is required'],
            min: [0, 'Budget amount cannot be negative'],
        },
        month: {
            type: Number,
            required: [true, 'Budget month is required'],
            min: [1, 'Month must be between 1 and 12'],
            max: [12, 'Month must be between 1 and 12'],
        },
        year: {
            type: Number,
            required: [true, 'Budget year is required'],
            min: [2000, 'Year must be 2000 or later'],
        },
        // If you implement user authentication later, you'd add:
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     ref: 'User',
        // },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

// Optional: Add a unique compound index to ensure one budget per category per month/year
// This prevents duplicate budgets for the same category in the same month/year.
budgetSchema.index({ category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
