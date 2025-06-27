import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  contact_info: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Pharmacy', pharmacySchema); 