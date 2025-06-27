import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema({
  logistics_company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LogisticsCenter', required: true },
  truck_number: { type: String, required: true },
  capacity: { type: Number, required: true }, // in kg
  base_price_per_km: { type: Number, required: true },
  is_available: { type: Boolean, default: true },
  current_location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  driver_name: { type: String },
  driver_contact: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Truck', truckSchema); 