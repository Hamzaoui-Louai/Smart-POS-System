import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  // Parse cookies robustly
  let token = null;
  if (req.headers.cookie) {
    
    const match = req.headers.cookie.match(/tigerToken=([^;]+)/);
    
    if (match) token = match[1];
    console.log("token", token);
    
  }
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found.' });
    console.log(req.user);
    
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