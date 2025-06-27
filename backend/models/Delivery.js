import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  transport_request_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportRequest', required: true },
  truck_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['assigned', 'picked_up', 'in_transit', 'delivered', 'confirmed'],
    default: 'assigned'
  },
  pickup_date: { type: Date },
  delivery_date: { type: Date },
  confirmation_date: { type: Date },
  notes: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Delivery', deliverySchema); 