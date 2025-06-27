import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  pharmacy_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  wholesaler_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  }],
  total_amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  transport_request_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportRequest' },
  estimated_delivery_date: { type: Date },
  actual_delivery_date: { type: Date },
  notes: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('PurchaseOrder', purchaseOrderSchema); 