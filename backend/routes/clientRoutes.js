import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { getPharmacies, searchMedicines, getMedicinePrice, getRefillSuggestions } from '../controllers/clientController.js';

const router = express.Router();

// All routes in this file require client role
router.use(authenticateToken, authorizeRoles('client'));

// View pharmacies and their locations
router.get('/pharmacies', getPharmacies);

// Search for medicines across pharmacies
router.get('/medicines/search', searchMedicines);

// View medicine prices
router.get('/medicines/:id/price', getMedicinePrice);

// Get refill suggestions
router.get('/refill-suggestions', getRefillSuggestions);

export default router; 