import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { getStock, searchStock, recordSale } from '../controllers/cashierController.js';

const router = express.Router();

// All routes in this file require cashier role
router.use(authenticateToken, authorizeRoles('cashier'));

// View and search pharmacy stock
router.get('/stock', getStock);
router.get('/stock/search', searchStock);

// Sell medicines and record sales
router.post('/sales', recordSale);

// Each sale links to the cashier for accountability
// (Handled in controller logic)

export default router; 