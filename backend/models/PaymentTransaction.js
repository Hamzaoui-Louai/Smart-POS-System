import mongoose from 'mongoose';

// Payment Transaction Model for storing payment records
const paymentTransactionSchema = new mongoose.Schema({
  // Payer information
  payer_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  payer_role: {
    type: String,
    enum: ['client', 'pharmacy_owner', 'wholesaler', 'logistics'],
    required: true
  },
  
  // Payee information (can be User or other entities like LogisticsCenter)
  payee_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  payee_type: {
    type: String,
    enum: ['user', 'logistics_center', 'supplier'],
    default: 'user'
  },
  payee_role: {
    type: String,
    enum: ['wholesaler', 'logistics', 'supplier', 'pharmacy_owner'],
    required: function() { return this.payee_type === 'user'; }
  },
  
  // Transaction details
  amount: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  
  // Payment type classification
  payment_type: {
    type: String,
    enum: ['client_purchase', 'pharmacy_to_wholesaler', 'wholesaler_to_logistics', 'other'],
    required: true
  },
  
  // Guiddini API related fields
  payment_reference: { 
    type: String, 
    required: true,
    unique: true
  },
  payment_order_number: { 
    type: String, 
    default: null 
  },
  payment_status: {
    type: String,
    enum: ['processing', 'completed', 'approved', 'failed', 'cancelled', 'refunded'],
    default: 'processing'
  },
  
  // Additional transaction metadata
  guiddini_response: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // Related entities
  related_sale_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Sale', 
    default: null 
  },
  related_stock_ids: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Stock' 
  }],
  
  // Delivery/logistics specific fields
  delivery_details: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // Payment completion details
  payment_completed_at: { 
    type: Date, 
    default: null 
  },
  payment_failed_at: { 
    type: Date, 
    default: null 
  },
  failure_reason: { 
    type: String, 
    default: null 
  },
  
  // Receipt information
  receipt_sent: { 
    type: Boolean, 
    default: false 
  },
  receipt_email: { 
    type: String, 
    default: null 
  },
  receipt_sent_at: { 
    type: Date, 
    default: null 
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
paymentTransactionSchema.index({ payer_id: 1, created_at: -1 });
paymentTransactionSchema.index({ payee_id: 1, created_at: -1 });
paymentTransactionSchema.index({ payment_reference: 1 });
paymentTransactionSchema.index({ payment_order_number: 1 });
paymentTransactionSchema.index({ payment_status: 1 });
paymentTransactionSchema.index({ payment_type: 1 });
paymentTransactionSchema.index({ created_at: -1 });

// Virtual for payee population based on type
paymentTransactionSchema.virtual('payee', {
  refPath: function() {
    if (this.payee_type === 'user') return 'User';
    if (this.payee_type === 'logistics_center') return 'LogisticsCenter';
    if (this.payee_type === 'supplier') return 'Supplier';
    return 'User'; // default
  },
  localField: 'payee_id',
  foreignField: '_id',
  justOne: true
});

// Ensure virtual fields are serialized
paymentTransactionSchema.set('toJSON', { virtuals: true });
paymentTransactionSchema.set('toObject', { virtuals: true });

// Instance method to update payment status
paymentTransactionSchema.methods.updatePaymentStatus = async function(status, guiddiniResponse = null) {
  this.payment_status = status;
  this.guiddini_response = guiddiniResponse;
  
  if (status === 'completed' || status === 'approved') {
    this.payment_completed_at = new Date();
  } else if (status === 'failed' || status === 'cancelled') {
    this.payment_failed_at = new Date();
    if (guiddiniResponse && guiddiniResponse.error_message) {
      this.failure_reason = guiddiniResponse.error_message;
    }
  }
  
  return await this.save();
};

// Static method to find transactions by user
paymentTransactionSchema.statics.findByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, status, payment_type } = options;
  
  let query = {
    $or: [
      { payer_id: userId },
      { payee_id: userId, payee_type: 'user' }
    ]
  };
  
  if (status) {
    query.payment_status = status;
  }
  
  if (payment_type) {
    query.payment_type = payment_type;
  }
  
  return this.find(query)
    .populate('payer_id', 'name email role')
    .populate('payee')
    .populate('related_sale_id')
    .sort({ created_at: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get payment statistics
paymentTransactionSchema.statics.getPaymentStats = function(dateRange = {}) {
  const { startDate, endDate } = dateRange;
  let matchStage = {};
  
  if (startDate || endDate) {
    matchStage.created_at = {};
    if (startDate) matchStage.created_at.$gte = new Date(startDate);
    if (endDate) matchStage.created_at.$lte = new Date(endDate);
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          payment_type: '$payment_type',
          payment_status: '$payment_status'
        },
        count: { $sum: 1 },
        total_amount: { $sum: '$amount' },
        avg_amount: { $avg: '$amount' }
      }
    },
    {
      $group: {
        _id: '$_id.payment_type',
        statuses: {
          $push: {
            status: '$_id.payment_status',
            count: '$count',
            total_amount: '$total_amount',
            avg_amount: '$avg_amount'
          }
        },
        total_transactions: { $sum: '$count' },
        total_value: { $sum: '$total_amount' }
      }
    }
  ]);
};

export default mongoose.model('PaymentTransaction', paymentTransactionSchema);