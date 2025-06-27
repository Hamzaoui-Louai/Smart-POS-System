import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['cookie'];
  
  
  const token = authHeader && authHeader.split('=')[1];
  
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found.' });
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to authorize based on user role(s)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
};