import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  actor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actor_role: {
    type: String,
    enum: ['admin', 'cashier', 'pharmacy_owner', 'logistics', 'wholesaler'],
    required: true
  },
  entity_type: { type: String, required: true },
  entity_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  action_type: { type: String, required: true },
  description: { type: String, required: true },
  ip_address: { type: String, default: null },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Log', logSchema); 