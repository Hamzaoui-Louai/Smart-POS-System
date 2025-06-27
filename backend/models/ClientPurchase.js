import mongoose from 'mongoose';

const clientPurchaseSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sale_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
  pharmacy_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClientPurchase', clientPurchaseSchema); 