import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import {
  getTransportRequests,
  addTruck,
  getTrucks,
  getDeliveries,
  confirmDelivery,
  updateDeliveryStatus
} from '../controllers/logisticsController.js';

const router = express.Router();

// All routes in this file require logistics role
router.use(authenticateToken, authorizeRoles('logistics'));

// Receive transport requests from wholesalers
router.get('/transport-requests', getTransportRequests);

// Set available trucks and their prices
router.post('/trucks', addTruck);
router.get('/trucks', getTrucks);

// Track deliveries
router.get('/deliveries', getDeliveries);

// Send delivery confirmations
router.post('/deliveries/:id/confirm', confirmDelivery);

// Update delivery status
router.put('/deliveries/:id/status', updateDeliveryStatus);

export default router; 