import mongoose from 'mongoose';

const expirationAlertSchema = new mongoose.Schema({
  stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  alert_date: { type: Date, required: true },
  severity_level: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    required: true
  },
  notified: { type: Boolean, default: false },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('ExpirationAlert', expirationAlertSchema); 