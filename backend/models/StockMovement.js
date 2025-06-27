import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  change: { type: Number, required: true },
  reason: {
    type: String,
    enum: ['restock', 'correction', 'return'],
    required: true
  },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('StockMovement', stockMovementSchema); 