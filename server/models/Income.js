// backend/models/Income.js
import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true }, // Primary date field
    // year and month can be derived from 'date' or stored for convenience
    // If you have a pre-save hook to populate these, that's fine.
    year: Number,
    month: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } // Added for completeness
});

// Pre-save hook to ensure year and month are populated from the date field
incomeSchema.pre('save', function(next) {
    if (this.date && this.isModified('date')) {
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth() + 1; // Months are 0-indexed in JS, 1-indexed for humans
    }
    this.updatedAt = Date.now(); // Update updatedAt on save
    next();
});

// Pre-update hook (for findByIdAndUpdate, etc. if you use updateOne/updateMany directly)
incomeSchema.pre('findOneAndUpdate', function(next) {
    if (this._update.date) {
        const newDate = new Date(this._update.date);
        this._update.year = newDate.getFullYear();
        this._update.month = newDate.getMonth() + 1;
    }
    this._update.updatedAt = Date.now();
    next();
});


export default mongoose.model('Income', incomeSchema);
