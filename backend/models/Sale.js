import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  cashier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pharmacy_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  total_amount: { type: Number, required: true },
  discount_amount: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Sale', saleSchema); 