import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import {
  createUser,
  listUsers,
  updateUser,
  deleteUser,
  getDashboard,
  getLogs
} from '../controllers/adminController.js';

const router = express.Router();

// All routes in this file require admin role
router.use(authenticateToken, authorizeRoles('admin'));

// Create any type of user
router.post('/users', createUser);

// Manage all users
router.get('/users', listUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// View global dashboards
router.get('/dashboard', getDashboard);

// View logs
router.get('/logs', getLogs);

export default router; 