import mongoose from 'mongoose';

const refillSuggestionSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  last_purchase_date: { type: Date, required: true },
  estimated_next_refill_date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['suggested', 'accepted', 'rejected'],
    default: 'suggested',
    required: true
  },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('RefillSuggestion', refillSuggestionSchema); 