import User from '../models/User.js';
import Log from '../models/Log.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register a new user (admin only)
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can register users.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    
    // Log the user creation
    await Log.create({
      actor_id: req.user.id,
      actor_role: req.user.role,
      entity_type: 'user',
      entity_id: user._id,
      action_type: 'add_user',
      description: `User ${user.email} (${role}) created by admin ${req.user.email}`,
      ip_address: req.ip
    });
    
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('tigerToken', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 864e5),
            secure: true,
            sameSite: 'none',
            path: '/'
          })
          res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Logout (client should just delete token)
export const logout = (req, res) => {
  res.json({ message: 'Logout successful. Please delete the token on client side.' });
};

// Signup for normal users (clients)
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: 'client' });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
      message: 'Signup successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};