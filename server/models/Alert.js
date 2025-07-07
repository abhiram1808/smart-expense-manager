// models/Alert.js
import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'success', 'danger'], default: 'info' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Alert', alertSchema);
