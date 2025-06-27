import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { getPharmacies, searchMedicines, getMedicinePrice, getRefillSuggestions } from '../controllers/clientController.js';

const router = express.Router();

// Allow all roles to access these routes
router.use(authenticateToken, authorizeRoles('client', 'admin', 'pharmacy_owner', 'cashier', 'wholesaler', 'logistics'));

// View pharmacies and their locations
router.post('/pharmacies', getPharmacies);

// Search for medicines across pharmacies
router.post('/medicines/search', searchMedicines);

// View medicine prices
router.get('/medicines/:id/price', getMedicinePrice);

// Get refill suggestions
router.get('/refill-suggestions', getRefillSuggestions);

export default router; 