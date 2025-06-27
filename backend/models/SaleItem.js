import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  sale_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
  stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

export default mongoose.model('SaleItem', saleItemSchema); 