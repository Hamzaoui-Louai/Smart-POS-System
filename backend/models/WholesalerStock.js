import mongoose from 'mongoose';

const wholesalerStockSchema = new mongoose.Schema({
  wholesaler_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  batch_number: { type: String },
  expiration_date: { type: Date, required: true },
  is_available: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('WholesalerStock', wholesalerStockSchema); 