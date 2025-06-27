import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['new_order', 'low_stock', 'expiring_stock', 'delivery_update', 'system'],
    required: true
  },
  entity_type: { type: String },
  entity_id: { type: mongoose.Schema.Types.ObjectId },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema); 