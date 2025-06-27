import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  barcode: { type: String, required: true, unique: true },
  price_for_one: { type: Number, required: true },
  price_for_quantity: { type: Number, required: true }
});

export default mongoose.model('Medicine', medicineSchema); 