import mongoose from 'mongoose';

const logisticsCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact_info: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('LogisticsCenter', logisticsCenterSchema); 