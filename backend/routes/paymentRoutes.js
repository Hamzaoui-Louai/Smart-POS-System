import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import {
  // Client purchase payments
  initiateClientPurchasePayment,
  verifyClientPurchasePayment,
  
  // Pharmacy payments to wholesalers
  initiatePharmacyToWholesalerPayment,
  verifyPharmacyToWholesalerPayment,
  
  // Logistics payments by wholesalers
  initiateLogisticsPayment,
  verifyLogisticsPayment,
  
  // Shared utilities
  getPaymentReceipt,
  sendPaymentReceiptEmail,
  getPaymentHistory,
  getPaymentStatistics
} from '../controllers/paymentController.js';

const router = express.Router();

// ======================= CLIENT PURCHASE PAYMENT ROUTES =======================

/**
 * @route   POST /api/payments/client/purchase/initiate
 * @desc    Initiate payment for client purchase (by cashier)
 * @access  Private (Cashier only)
 * @body    { sale_id: string, client_email: string }
 */
router.post('/client/purchase/initiate', 
  authenticateToken, 
  authorizeRoles('cashier'), 
  initiateClientPurchasePayment
);

/**
 * @route   POST /api/payments/client/purchase/verify
 * @desc    Verify client purchase payment status
 * @access  Private (Client only)
 * @body    { sale_id: string, order_number: string }
 */
router.post('/client/purchase/verify', 
  authenticateToken, 
  authorizeRoles('client'), 
  verifyClientPurchasePayment
);

// ======================= PHARMACY TO WHOLESALER PAYMENT ROUTES =======================

/**
 * @route   POST /api/payments/pharmacy/wholesaler/initiate
 * @desc    Initiate payment from pharmacy to wholesaler
 * @access  Private (Pharmacy Owner only)
 * @body    { 
 *   wholesaler_id: string, 
 *   amount: number, 
 *   description: string, 
 *   stock_ids?: string[] 
 * }
 */
router.post('/pharmacy/wholesaler/initiate', 
  authenticateToken, 
  authorizeRoles('pharmacy_owner'), 
  initiatePharmacyToWholesalerPayment
);

/**
 * @route   POST /api/payments/pharmacy/wholesaler/verify
 * @desc    Verify pharmacy payment to wholesaler status
 * @access  Private (Pharmacy Owner only)
 * @body    { order_number: string, payment_reference: string }
 */
router.post('/pharmacy/wholesaler/verify', 
  authenticateToken, 
  authorizeRoles('pharmacy_owner'), 
  verifyPharmacyToWholesalerPayment
);

// ======================= LOGISTICS PAYMENT ROUTES =======================

/**
 * @route   POST /api/payments/logistics/initiate
 * @desc    Initiate payment for logistics services
 * @access  Private (Wholesaler only)
 * @body    { 
 *   logistics_center_id: string, 
 *   amount: number, 
 *   description: string, 
 *   delivery_details?: object 
 * }
 */
router.post('/logistics/initiate', 
  authenticateToken, 
  authorizeRoles('wholesaler'), 
  initiateLogisticsPayment
);

/**
 * @route   POST /api/payments/logistics/verify
 * @desc    Verify logistics payment status
 * @access  Private (Wholesaler only)
 * @body    { order_number: string, payment_reference: string }
 */
router.post('/logistics/verify', 
  authenticateToken, 
  authorizeRoles('wholesaler'), 
  verifyLogisticsPayment
);

// ======================= SHARED UTILITY ROUTES =======================

/**
 * @route   GET /api/payments/receipt/:order_number
 * @desc    Get payment receipt
 * @access  Private (All authenticated users)
 * @params  order_number: string
 */
router.get('/receipt/:order_number', 
  authenticateToken, 
  getPaymentReceipt
);

/**
 * @route   POST /api/payments/receipt/email
 * @desc    Send payment receipt via email
 * @access  Private (All authenticated users)
 * @body    { order_number: string, email: string }
 */
router.post('/receipt/email', 
  authenticateToken, 
  sendPaymentReceiptEmail
);

/**
 * @route   GET /api/payments/history
 * @desc    Get payment history for authenticated user
 * @access  Private (All authenticated users)
 * @query   { page?: number, limit?: number, status?: string, payment_type?: string }
 */
router.get('/history', 
  authenticateToken, 
  getPaymentHistory
);

// ======================= ADMIN MONITORING ROUTES (Optional) =======================

/**
 * @route   GET /api/payments/admin/overview
 * @desc    Get payment overview for admin monitoring
 * @access  Private (Admin only)
 */
router.get('/admin/overview', 
  authenticateToken, 
  authorizeRoles('admin'), 
  async (req, res) => {
    try {
      // This would require additional implementation
      // Get payment statistics, recent transactions, etc.
      
      res.json({
        message: 'Payment overview endpoint - to be implemented',
        note: 'This endpoint would provide payment statistics and monitoring data for admins'
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
);

/**
 * @route   GET /api/payments/admin/transactions
 * @desc    Get all payment transactions for admin
 * @access  Private (Admin only)
 * @query   { page?: number, limit?: number, status?: string, user_role?: string }
 */
router.get('/admin/transactions', 
  authenticateToken, 
  authorizeRoles('admin'), 
  async (req, res) => {
    try {
      const { page = 1, limit = 20, status, user_role } = req.query;
      
      // This would require querying your payment transaction model
      // and joining with user data for comprehensive admin view
      
      res.json({
        message: 'Admin transactions endpoint - to be implemented',
        note: 'This endpoint would provide comprehensive transaction data for admin monitoring',
        requested_filters: { page, limit, status, user_role }
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
);

// Payment statistics route
router.get('/statistics', 
  authenticateToken, 
  authorizeRoles('admin', 'pharmacy_owner', 'wholesaler'), 
  getPaymentStatistics
);

export default router;