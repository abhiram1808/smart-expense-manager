// server/models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  type: { // Assuming 'expense', 'income', 'budget' types for categories
    type: String,
    enum: ['expense', 'income', 'budget'],
    required: true,
  },
  user: { // Optional: if you implement user authentication
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Category', categorySchema);
