// backend/models/Expense.js
import mongoose from 'mongoose';

const expenseSchema = mongoose.Schema(
    {
        category: {
            type: String,
            required: [true, 'Expense category is required'],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, 'Expense amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        date: {
            type: Date,
            required: [true, 'Expense date is required'],
        },
        description: {
            type: String,
            trim: true,
            default: '', // Description can be optional
        },
        // --- CRITICAL FIX: Remove 'required: true' from month and year ---
        month: {
            type: Number, // 1-12
            min: [1, 'Month must be between 1 and 12'],
            max: [12, 'Month must be between 1 and 12'],
            // required: true, // REMOVED
        },
        year: {
            type: Number,
            // required: true, // REMOVED
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

// Pre-save hook to automatically set month and year from the date
expenseSchema.pre('save', function (next) {
    if (this.date) {
        const d = new Date(this.date);
        this.month = d.getMonth() + 1; // getMonth() is 0-indexed
        this.year = d.getFullYear();
    }
    next();
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
