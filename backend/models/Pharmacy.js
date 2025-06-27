import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  contact_info: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  created_at: { type: Date, default: Date.now }
});

// Add 2dsphere index for geospatial queries
pharmacySchema.index({ location: '2dsphere' });

export default mongoose.model('Pharmacy', pharmacySchema); 