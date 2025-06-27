import fetch from 'node-fetch';
import Sale from '../models/Sale.js';
import SaleItem from '../models/SaleItem.js';
import Stock from '../models/Stock.js';
import User from '../models/User.js';
import Pharmacy from '../models/Pharmacy.js';
import Supplier from '../models/Supplier.js';
import LogisticsCenter from '../models/LogisticsCenter.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import Log from '../models/Log.js';

// Guiddini API configuration
const GUIDDINI_API_BASE = 'https://epay.guiddini.dz';
const APP_KEY = process.env.GUIDDINI_APP_KEY;
const APP_SECRET = process.env.GUIDDINI_APP_SECRET;

// Helper function to make Guiddini API requests
const makeGuiddiniRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-app-key': APP_KEY,
      'x-app-secret': APP_SECRET
    }
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const url = method === 'GET' && body 
    ? `${GUIDDINI_API_BASE}${endpoint}?${new URLSearchParams(body).toString()}`
    : `${GUIDDINI_API_BASE}${endpoint}`;

  const response = await fetch(url, options);
  return await response.json();
};

// Log payment activity
const logPaymentActivity = async (actorId, actorRole, entityType, entityId, actionType, description, ipAddress = null) => {
  try {
    await Log.create({
      actor_id: actorId,
      actor_role: actorRole,
      entity_type: entityType,
      entity_id: entityId,
      action_type: actionType,
      description: description,
      ip_address: ipAddress
    });
  } catch (error) {
    console.error('Error logging payment activity:', error);
  }
};

// ======================= CLIENT PURCHASE PAYMENTS =======================

// Initiate client purchase payment
export const initiateClientPurchasePayment = async (req, res) => {
  try {
    const { sale_id, client_email } = req.body;
    const cashierId = req.user.id;

    // Find client by email
    const client = await User.findOne({ email: client_email, role: 'client' });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    const clientId = client._id;

    // Verify sale exists
    const sale = await Sale.findById(sale_id)
      .populate('pharmacy_id', 'name')
      .populate('cashier_id', 'name');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Update sale with client_id if not already set
    if (!sale.client_id) {
      sale.client_id = clientId;
      await sale.save();
    } else if (sale.client_id.toString() !== clientId.toString()) {
      return res.status(400).json({ message: 'Sale is already associated with a different client.' });
    }

    // Check if payment already exists for this sale
    const existingPayment = await PaymentTransaction.findOne({ 
      related_sale_id: sale_id,
      payment_status: { $nin: ['failed', 'cancelled'] }
    });

    if (existingPayment) {
      return res.status(400).json({ 
        message: 'Payment already exists for this sale',
        existing_payment: existingPayment
      });
    }

    // Calculate final amount (total - discount)
    const finalAmount = sale.total_amount - sale.discount_amount;

    // Initiate payment with Guiddini
    const paymentResponse = await makeGuiddiniRequest('/api/payment/initiate', 'POST', {
      amount: finalAmount.toString()
    });

    if (!paymentResponse.data) {
      return res.status(400).json({ 
        message: 'Failed to initiate payment',
        error: paymentResponse 
      });
    }

    // Create payment transaction record
    const paymentTransaction = await PaymentTransaction.create({
      payer_id: clientId,
      payer_role: 'client',
      payee_id: sale.pharmacy_id._id,
      payee_type: 'user',
      payee_role: 'pharmacy_owner',
      amount: finalAmount,
      description: `Purchase payment for sale ${sale_id}`,
      payment_type: 'client_purchase',
      payment_reference: paymentResponse.data.id,
      payment_status: 'processing',
      related_sale_id: sale_id,
      guiddini_response: paymentResponse.data
    });

    // Update sale with payment reference
    sale.payment_reference = paymentResponse.data.id;
    sale.payment_status = 'processing';
    await sale.save();

    // Log activity (actor is cashier)
    await logPaymentActivity(
      cashierId,
      'cashier',
      'payment_transaction',
      paymentTransaction._id,
      'payment_initiated',
      `Cashier initiated payment for client ${client.email} for sale ${sale_id} - Amount: ${finalAmount} DZD`,
      req.ip
    );

    res.json({
      message: 'Payment initiated successfully',
      payment_data: paymentResponse.data,
      payment_transaction: paymentTransaction,
      sale_details: {
        id: sale._id,
        total_amount: sale.total_amount,
        discount_amount: sale.discount_amount,
        final_amount: finalAmount,
        pharmacy: sale.pharmacy_id.name,
        client: client.email
      }
    });

  } catch (error) {
    console.error('Error initiating client purchase payment:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Verify client purchase payment
export const verifyClientPurchasePayment = async (req, res) => {
  try {
    const { sale_id, order_number } = req.body;
    const clientId = req.user.id;

    // Find payment transaction
    const paymentTransaction = await PaymentTransaction.findOne({
      related_sale_id: sale_id,
      payer_id: clientId
    });

    if (!paymentTransaction) {
      return res.status(404).json({ message: 'Payment transaction not found' });
    }

    // Check payment status with Guiddini
    const paymentStatus = await makeGuiddiniRequest('/api/payment/show', 'GET', {
      order_number: order_number
    });

    if (!paymentStatus.data) {
      return res.status(400).json({ 
        message: 'Failed to retrieve payment status',
        error: paymentStatus 
      });
    }

    const status = paymentStatus.data.attributes.status;

    // Update payment transaction
    paymentTransaction.payment_order_number = order_number;
    await paymentTransaction.updatePaymentStatus(status, paymentStatus.data.attributes);

    // Update sale
    const sale = await Sale.findById(sale_id);
    if (sale) {
      sale.payment_status = status;
      sale.payment_order_number = order_number;

      if (status === 'completed' || status === 'approved') {
        sale.payment_completed_at = new Date();
        
        // Update stock quantities for completed purchases
        const saleItems = await SaleItem.find({ sale_id: sale_id });
        for (const item of saleItems) {
          const stock = await Stock.findById(item.stock_id);
          if (stock && stock.stock_quantity >= item.quantity) {
            stock.stock_quantity -= item.quantity;
            await stock.save();
          }
        }
      }

      await sale.save();
    }

    // Log activity
    await logPaymentActivity(
      clientId,
      'client',
      'payment_transaction',
      paymentTransaction._id,
      'payment_verified',
      `Client payment verification - Status: ${status}, Order: ${order_number}`,
      req.ip
    );

    res.json({
      message: 'Payment status verified',
      payment_status: status,
      payment_details: paymentStatus.data.attributes,
      payment_transaction: paymentTransaction,
      sale_updated: true
    });

  } catch (error) {
    console.error('Error verifying client purchase payment:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ======================= PHARMACY PAYMENTS TO WHOLESALERS =======================

// Initiate pharmacy payment to wholesaler
export const initiatePharmacyToWholesalerPayment = async (req, res) => {
  try {
    const { wholesaler_id, amount, description, stock_ids } = req.body;
    const pharmacyOwnerId = req.user.id;

    // Validate input
    if (!wholesaler_id || !amount || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields: wholesaler_id, amount, description' 
      });
    }

    // Verify wholesaler exists
    const wholesaler = await User.findById(wholesaler_id);
    if (!wholesaler || wholesaler.role !== 'wholesaler') {
      return res.status(404).json({ message: 'Wholesaler not found' });
    }

    // Verify pharmacy owner
    const pharmacyOwner = await User.findById(pharmacyOwnerId);
    if (!pharmacyOwner || pharmacyOwner.role !== 'pharmacy_owner') {
      return res.status(403).json({ message: 'Only pharmacy owners can make payments to wholesalers' });
    }

    // Initiate payment with Guiddini
    const paymentResponse = await makeGuiddiniRequest('/api/payment/initiate', 'POST', {
      amount: amount.toString()
    });

    if (!paymentResponse.data) {
      return res.status(400).json({ 
        message: 'Failed to initiate payment',
        error: paymentResponse 
      });
    }

    // Create payment transaction record
    const paymentTransaction = await PaymentTransaction.create({
      payer_id: pharmacyOwnerId,
      payer_role: 'pharmacy_owner',
      payee_id: wholesaler_id,
      payee_type: 'user',
      payee_role: 'wholesaler',
      amount: amount,
      description: description,
      payment_type: 'pharmacy_to_wholesaler',
      payment_reference: paymentResponse.data.id,
      payment_status: 'processing',
      related_stock_ids: stock_ids || [],
      guiddini_response: paymentResponse.data
    });

    // Log activity
    await logPaymentActivity(
      pharmacyOwnerId,
      'pharmacy_owner',
      'payment_transaction',
      paymentTransaction._id,
      'payment_initiated',
      `Pharmacy owner initiated payment to wholesaler ${wholesaler.name} - Amount: ${amount} DZD`,
      req.ip
    );

    res.json({
      message: 'Payment to wholesaler initiated successfully',
      payment_data: paymentResponse.data,
      payment_transaction: paymentTransaction,
      wholesaler_info: {
        id: wholesaler._id,
        name: wholesaler.name,
        email: wholesaler.email
      }
    });

  } catch (error) {
    console.error('Error initiating pharmacy to wholesaler payment:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Verify pharmacy payment to wholesaler
export const verifyPharmacyToWholesalerPayment = async (req, res) => {
  try {
    const { order_number, payment_reference } = req.body;
    const pharmacyOwnerId = req.user.id;

    // Find payment transaction
    const paymentTransaction = await PaymentTransaction.findOne({
      payment_reference: payment_reference,
      payer_id: pharmacyOwnerId,
      payment_type: 'pharmacy_to_wholesaler'
    }).populate('payee_id', 'name email');

    if (!paymentTransaction) {
      return res.status(404).json({ message: 'Payment transaction not found' });
    }

    // Check payment status with Guiddini
    const paymentStatus = await makeGuiddiniRequest('/api/payment/show', 'GET', {
      order_number: order_number
    });

    if (!paymentStatus.data) {
      return res.status(400).json({ 
        message: 'Failed to retrieve payment status',
        error: paymentStatus 
      });
    }

    const status = paymentStatus.data.attributes.status;

    // Update payment transaction
    paymentTransaction.payment_order_number = order_number;
    await paymentTransaction.updatePaymentStatus(status, paymentStatus.data.attributes);

    // Log activity
    await logPaymentActivity(
      pharmacyOwnerId,
      'pharmacy_owner',
      'payment_transaction',
      paymentTransaction._id,
      'payment_verified',
      `Pharmacy payment to wholesaler verification - Status: ${status}, Order: ${order_number}`,
      req.ip
    );

    res.json({
      message: 'Payment status verified',
      payment_status: status,
      payment_details: paymentStatus.data.attributes,
      payment_transaction: paymentTransaction,
      order_number: order_number
    });

  } catch (error) {
    console.error('Error verifying pharmacy to wholesaler payment:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ======================= LOGISTICS PAYMENTS BY WHOLESALERS =======================

// Initiate logistics payment by wholesaler
export const initiateLogisticsPayment = async (req, res) => {
  try {
    const { logistics_center_id, amount, description, delivery_details } = req.body;
    const wholesalerId = req.user.id;

    // Validate input
    if (!logistics_center_id || !amount || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields: logistics_center_id, amount, description' 
      });
    }

    // Verify logistics center exists
    const logisticsCenter = await LogisticsCenter.findById(logistics_center_id);
    if (!logisticsCenter) {
      return res.status(404).json({ message: 'Logistics center not found' });
    }

    // Verify wholesaler
    const wholesaler = await User.findById(wholesalerId);
    if (!wholesaler || wholesaler.role !== 'wholesaler') {
      return res.status(403).json({ message: 'Only wholesalers can make logistics payments' });
    }

    // Initiate payment with Guiddini
    const paymentResponse = await makeGuiddiniRequest('/api/payment/initiate', 'POST', {
      amount: amount.toString()
    });

    if (!paymentResponse.data) {
      return res.status(400).json({ 
        message: 'Failed to initiate payment',
        error: paymentResponse 
      });
    }

    // Create payment transaction record
    const paymentTransaction = await PaymentTransaction.create({
      payer_id: wholesalerId,
      payer_role: 'wholesaler',
      payee_id: logistics_center_id,
      payee_type: 'logistics_center',
      amount: amount,
      description: description,
      payment_type: 'wholesaler_to_logistics',
      payment_reference: paymentResponse.data.id,
      payment_status: 'processing',
      delivery_details: delivery_details || {},
      guiddini_response: paymentResponse.data
    });

    // Log activity
    await logPaymentActivity(
      wholesalerId,
      'wholesaler',
      'payment_transaction',
      paymentTransaction._id,
      'payment_initiated',
      `Wholesaler initiated logistics payment to ${logisticsCenter.name} - Amount: ${amount} DZD`,
      req.ip
    );

    res.json({
      message: 'Logistics payment initiated successfully',
      payment_data: paymentResponse.data,
      payment_transaction: paymentTransaction,
      logistics_center_info: {
        id: logisticsCenter._id,
        name: logisticsCenter.name,
        contact_info: logisticsCenter.contact_info
      }
    });

  } catch (error) {
    console.error('Error initiating logistics payment:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Verify logistics payment by wholesaler
export const verifyLogisticsPayment = async (req, res) => {
  try {
    const { order_number, payment_reference } = req.body;
    const wholesalerId = req.user.id;

    // Find payment transaction
    const paymentTransaction = await PaymentTransaction.findOne({
      payment_reference: payment_reference,
      payer_id: wholesalerId,
      payment_type: 'wholesaler_to_logistics'
    }).populate({
      path: 'payee_id',
      model: 'LogisticsCenter',
      select: 'name contact_info'
    });

    if (!paymentTransaction) {
      return res.status(404).json({ message: 'Payment transaction not found' });
    }

    // Check payment status with Guiddini
    const paymentStatus = await makeGuiddiniRequest('/api/payment/show', 'GET', {
      order_number: order_number
    });

    if (!paymentStatus.data) {
      return res.status(400).json({ 
        message: 'Failed to retrieve payment status',
        error: paymentStatus 
      });
    }

    const status = paymentStatus.data.attributes.status;

    // Update payment transaction
    paymentTransaction.payment_order_number = order_number;
    await paymentTransaction.updatePaymentStatus(status, paymentStatus.data.attributes);

    // Log activity
    await logPaymentActivity(
      wholesalerId,
      'wholesaler',
      'payment_transaction',
      paymentTransaction._id,
      'payment_verified',
      `Wholesaler logistics payment verification - Status: ${status}, Order: ${order_number}`,
      req.ip
    );

    res.json({
      message: 'Payment status verified',
      payment_status: status,
      payment_details: paymentStatus.data.attributes,
      payment_transaction: paymentTransaction,
      order_number: order_number
    });

  } catch (error) {
    console.error('Error verifying logistics payment:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ======================= SHARED UTILITIES =======================

// Get payment receipt
export const getPaymentReceipt = async (req, res) => {
  try {
    const { order_number } = req.params;
    const userId = req.user.id;

    // Verify user has access to this payment
    const paymentTransaction = await PaymentTransaction.findOne({
      $or: [
        { payer_id: userId },
        { payee_id: userId, payee_type: 'user' }
      ],
      payment_order_number: order_number
    });

    if (!paymentTransaction && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied to this payment receipt' });
    }

    // Get receipt from Guiddini
    const receipt = await makeGuiddiniRequest('/api/payment/receipt', 'GET', {
      order_number: order_number
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Log activity
    await logPaymentActivity(
      userId,
      req.user.role,
      'payment_transaction',
      paymentTransaction?._id || order_number,
      'receipt_requested',
      `Receipt requested for order: ${order_number}`,
      req.ip
    );

    res.json({
      message: 'Receipt retrieved successfully',
      receipt: receipt,
      payment_transaction: paymentTransaction
    });

  } catch (error) {
    console.error('Error getting payment receipt:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Send payment receipt via email
export const sendPaymentReceiptEmail = async (req, res) => {
  try {
    const { order_number, email } = req.body;
    const userId = req.user.id;

    if (!order_number || !email) {
      return res.status(400).json({ message: 'Missing required fields: order_number, email' });
    }

    // Verify user has access to this payment
    const paymentTransaction = await PaymentTransaction.findOne({
      $or: [
        { payer_id: userId },
        { payee_id: userId, payee_type: 'user' }
      ],
      payment_order_number: order_number
    });

    if (!paymentTransaction && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied to this payment' });
    }

    // Send email receipt via Guiddini
    const emailResult = await makeGuiddiniRequest('/api/payment/email', 'POST', {
      order_number: order_number,
      email: email
    });

    // Update payment transaction with receipt info
    if (paymentTransaction) {
      paymentTransaction.receipt_sent = true;
      paymentTransaction.receipt_email = email;
      paymentTransaction.receipt_sent_at = new Date();
      await paymentTransaction.save();
    }

    // Log activity
    await logPaymentActivity(
      userId,
      req.user.role,
      'payment_transaction',
      paymentTransaction?._id || order_number,
      'receipt_emailed',
      `Receipt emailed to ${email} for order: ${order_number}`,
      req.ip
    );

    res.json({
      message: 'Receipt sent successfully',
      result: emailResult,
      email_sent_to: email
    });

  } catch (error) {
    console.error('Error sending payment receipt email:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get payment history for user
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, payment_type } = req.query;

    // Get payment transactions for user
    const payments = await PaymentTransaction.findByUser(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      payment_type
    });

    // Get total count for pagination
    let countQuery = {
      $or: [
        { payer_id: userId },
        { payee_id: userId, payee_type: 'user' }
      ]
    };

    if (status) countQuery.payment_status = status;
    if (payment_type) countQuery.payment_type = payment_type;

    const totalCount = await PaymentTransaction.countDocuments(countQuery);

    res.json({
      message: 'Payment history retrieved successfully',
      payments: payments,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalCount / limit),
        total_count: totalCount,
        per_page: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getting payment history:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get payment statistics (for admin and analytics)
export const getPaymentStatistics = async (req, res) => {
  try {
    const { start_date, end_date, user_role } = req.query;

    // Build date range
    const dateRange = {};
    if (start_date) dateRange.startDate = start_date;
    if (end_date) dateRange.endDate = end_date;

    // Get payment statistics
    const stats = await PaymentTransaction.getPaymentStats(dateRange);

    // Get additional metrics
    const totalTransactions = await PaymentTransaction.countDocuments(
      dateRange.startDate || dateRange.endDate ? {
        created_at: {
          ...(dateRange.startDate && { $gte: new Date(dateRange.startDate) }),
          ...(dateRange.endDate && { $lte: new Date(dateRange.endDate) })
        }
      } : {}
    );

    const avgTransactionValue = await PaymentTransaction.aggregate([
      ...(dateRange.startDate || dateRange.endDate ? [{
        $match: {
          created_at: {
            ...(dateRange.startDate && { $gte: new Date(dateRange.startDate) }),
            ...(dateRange.endDate && { $lte: new Date(dateRange.endDate) })
          }
        }
      }] : []),
      {
        $group: {
          _id: null,
          avg_amount: { $avg: '$amount' },
          total_amount: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      message: 'Payment statistics retrieved successfully',
      statistics: {
        payment_breakdown: stats,
        total_transactions: totalTransactions,
        average_transaction_value: avgTransactionValue[0]?.avg_amount || 0,
        total_value: avgTransactionValue[0]?.total_amount || 0
      },
      date_range: dateRange
    });

  } catch (error) {
    console.error('Error getting payment statistics:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};