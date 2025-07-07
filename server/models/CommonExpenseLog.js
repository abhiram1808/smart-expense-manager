import mongoose from 'mongoose';

const commonExpenseLogSchema = new mongoose.Schema({
  commonExpenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommonExpense',
    required: true
  },
  action: {
    type: String,
    enum: ['created', 'updated', 'deleted', 'paused', 'resumed', 'split'],
    required: true
  },
  previousData: mongoose.Schema.Types.Mixed,
  updatedData: mongoose.Schema.Types.Mixed,
  description: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('CommonExpenseLog', commonExpenseLogSchema);
