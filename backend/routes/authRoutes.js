import express from 'express';
import { register, login, logout, signup } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Signup route (public)
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Register route (admin only)
router.post('/register', authenticateToken, register);

// Logout route
router.post('/logout', authenticateToken, logout);

export default router;
