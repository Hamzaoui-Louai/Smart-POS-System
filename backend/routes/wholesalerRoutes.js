import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import {
  getStock,
  updateStock,
  addStock,
  getPurchaseRequests,
  updatePurchaseOrderStatus,
  createLogisticsRequest,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getDashboard,
  addStockMovement,
  getStockMovements
} from '../controllers/wholesalerController.js';

const router = express.Router();

// All routes in this file require wholesaler role
router.use(authenticateToken, authorizeRoles('wholesaler'));

// Manage own medicine stock
router.get('/stock', getStock);
router.post('/stock', addStock);
router.put('/stock/:id', updateStock);

// Receive purchase requests from pharmacies
router.get('/purchase-requests', getPurchaseRequests);
router.put('/purchase-requests/:id/status', updatePurchaseOrderStatus);

// Create logistics requests for deliveries
router.post('/logistics-requests', createLogisticsRequest);

// Get notified on new orders
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);
router.put('/notifications/read-all', markAllNotificationsAsRead);

// Dashboard
router.get('/dashboard', getDashboard);

// Stock movement endpoints
router.post('/stock/movement', addStockMovement);
router.get('/stock/movement', getStockMovements);

export default router; 