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
        // Start date for the recurring expense
        startDate: {
            type: Date,
            required: [true, 'Start date is required for common expense'],
        },
        // NEW: Optional term in months. If provided, endDate can be derived.
        termMonths: {
            type: Number,
            min: [1, 'Term in months must be at least 1'],
            default: null, // Null for indefinite or if endDate is explicitly set
        },
        // Optional end date for the recurring expense. Takes precedence over termMonths if both are set.
        endDate: {
            type: Date,
            default: null, // Can be null for indefinite recurring expenses
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

// Pre-save hook to handle startDate, endDate, and termMonths logic
commonExpenseSchema.pre('save', function (next) {
    // Ensure startDate is always normalized to start of day for consistent comparisons
    if (this.startDate) {
        this.startDate.setHours(0, 0, 0, 0);
    }

    // If termMonths is provided and endDate is NOT explicitly set, calculate endDate
    if (this.termMonths !== null && this.startDate && !this.isModified('endDate')) {
        const calculatedEndDate = new Date(this.startDate);
        calculatedEndDate.setMonth(calculatedEndDate.getMonth() + this.termMonths);
        // Set to the last day of the calculated month to ensure it covers the full term
        calculatedEndDate.setDate(0); // This sets it to the last day of the previous month
        calculatedEndDate.setDate(calculatedEndDate.getDate() + 1); // This sets it to the first day of the calculated month
        calculatedEndDate.setDate(calculatedEndDate.getDate() -1); // This sets it to the last day of the calculated month
        calculatedEndDate.setHours(23, 59, 59, 999); // Set to end of day

        this.endDate = calculatedEndDate;
    }

    // Validation: endDate cannot be before startDate
    if (this.startDate && this.endDate && this.endDate < this.startDate) {
        return next(new Error('End date cannot be before start date.'));
    }

    // If endDate is explicitly set to null, ensure termMonths is also null
    if (this.endDate === null && this.termMonths !== null) {
        this.termMonths = null;
    }

    next();
});

const CommonExpense = mongoose.model('CommonExpense', commonExpenseSchema);

export default CommonExpense;
