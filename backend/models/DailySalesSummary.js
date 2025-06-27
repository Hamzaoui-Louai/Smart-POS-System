import mongoose from 'mongoose';

const dailySalesSummarySchema = new mongoose.Schema({
  entity_type: {
    type: String,
    enum: ['pharmacy', 'supplier', 'logistics'],
    required: true
  },
  entity_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  total_sales_amount: { type: Number, required: true },
  total_transactions: { type: Number, required: true },
  most_sold_medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', default: null },
  report_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('DailySalesSummary', dailySalesSummarySchema); 