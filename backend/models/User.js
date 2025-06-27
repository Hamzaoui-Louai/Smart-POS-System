import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'cashier', 'pharmacy_owner', 'logistics', 'wholesaler','client'],
    required: true
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema); 