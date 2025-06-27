import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  stock_quantity: { type: Number, required: true },
  expiration_date: { type: Date, required: true },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Stock', stockSchema); 