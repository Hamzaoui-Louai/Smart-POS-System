import mongoose from 'mongoose';

const pharmacyCashierSchema = new mongoose.Schema({
  pharmacy_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  cashier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  is_active: { type: Boolean, default: true },
  assigned_at: { type: Date, default: Date.now },
  unassigned_at: { type: Date }
});

export default mongoose.model('PharmacyCashier', pharmacyCashierSchema); 