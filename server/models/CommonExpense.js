// backend/models/CommonExpense.js
import mongoose from 'mongoose';

const commonExpenseSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Common expense name is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required for common expense'],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required for common expense'],
            min: [0, 'Amount cannot be negative'],
        },
        // Day of the month when this expense typically occurs/is due
        dayOfMonth: {
            type: Number,
            required: [true, 'Day of month is required'],
            min: [1, 'Day must be between 1 and 31'],
            max: [31, 'Day must be between 1 and 31'],
        },
        // Indicates if this common expense is currently active for auto-insertion
        isActive: {
            type: Boolean,
            default: true,
        },
        // Optional: Last date this common expense was auto-inserted
        lastInsertedDate: {
            type: Date,
            default: null,
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

// Optional: Add a unique compound index if you want to prevent duplicate common expenses
// with the same name and category. Consider if a user might have two distinct "Rent" expenses.
// For simplicity, we won't add a unique index by default, allowing multiple common expenses
// with the same name/category if they represent different recurring items.

const CommonExpense = mongoose.model('CommonExpense', commonExpenseSchema);

export default CommonExpense;
