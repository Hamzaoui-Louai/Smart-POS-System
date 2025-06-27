import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import {
  updatePharmacyProfile,
  getPharmacyProfile,
  getPharmacyStock,
  updateStock,
  assignCashier,
  getAssignedCashiers,
  createPurchaseOrder,
  getPurchaseOrders,
  getDeliveries,
  getAnalytics,
  addStockMovement,
  getStockMovements
} from '../controllers/pharmacyOwnerController.js';

const router = express.Router();

// All routes in this file require pharmacy_owner role
router.use(authenticateToken, authorizeRoles('pharmacy_owner'));

// Manage pharmacy profile
router.get('/pharmacy/profile', getPharmacyProfile);
router.put('/pharmacy/profile', updatePharmacyProfile);

// Manage pharmacy stock
router.get('/pharmacy/stock', getPharmacyStock);
router.put('/pharmacy/stock/:id', updateStock);

// Assign cashiers to pharmacy
router.post('/pharmacy/cashiers', assignCashier);
router.get('/pharmacy/cashiers', getAssignedCashiers);

// Purchase from wholesalers
router.post('/wholesaler/purchase', createPurchaseOrder);
router.get('/purchase-orders', getPurchaseOrders);

// Track deliveries and orders
router.get('/deliveries', getDeliveries);

// View analytics dashboard
router.get('/analytics', getAnalytics);

// Stock movement endpoints
router.post('/pharmacy/stock/movement', addStockMovement);
router.get('/pharmacy/stock/movement', getStockMovements);

export default router; 