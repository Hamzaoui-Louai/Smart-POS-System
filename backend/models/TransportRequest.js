import mongoose from 'mongoose';

const transportRequestSchema = new mongoose.Schema({
  wholesaler_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  logistics_company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LogisticsCenter', required: true },
  destination_pharmacy_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  items: [{
    medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true }
  }],
  total_amount: { type: Number, required: true },
  transport_fee: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  estimated_delivery_date: { type: Date },
  actual_delivery_date: { type: Date },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('TransportRequest', transportRequestSchema); 