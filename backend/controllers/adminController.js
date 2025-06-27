import User from '../models/User.js';
import Log from '../models/Log.js';
import Pharmacy from '../models/Pharmacy.js';
import LogisticsCenter from '../models/LogisticsCenter.js';
import Sale from '../models/Sale.js';
import bcrypt from 'bcrypt';

// User management
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    // Log the action
    await Log.create({
      actor_id: req.user.id,
      actor_role: req.user.role,
      entity_type: 'user',
      entity_id: user._id,
      action_type: 'add_user',
      description: `User ${user.email} (${role}) created by admin ${req.user.email}`,
      ip_address: req.ip
    });
    res.status(201).json({ message: 'User created successfully.', user: { id: user._id, name, email, role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (role) update.role = role;
    if (password) update.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User updated successfully.', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    // Log the action
    await Log.create({
      actor_id: req.user.id,
      actor_role: req.user.role,
      entity_type: 'user',
      entity_id: user._id,
      action_type: 'remove_user',
      description: `User ${user.email} (${user.role}) deleted by admin ${req.user.email}`,
      ip_address: req.ip
    });
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Dashboard
export const getDashboard = async (req, res) => {
  try {
    // User growth in last 6 months
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString('default', { month: 'short', year: 'numeric' }),
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 1)
      });
    }
    const userGrowth = await Promise.all(
      months.map(async (m) => {
        const count = await User.countDocuments({ createdAt: { $gte: m.start, $lt: m.end } });
        return { month: m.label, count };
      })
    );

    // Total pharmacies
    const totalPharmacies = await Pharmacy.countDocuments();
    // Total users
    const totalUsers = await User.countDocuments();
    // Total logistics companies
    const totalLogistics = await LogisticsCenter.countDocuments();
    // Total money transferred
    const totalMoneyTransferred = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: '$total_amount' } } }
    ]);

    res.json({
      userGrowth,
      totalPharmacies,
      totalUsers,
      totalLogistics,
      totalMoneyTransferred: totalMoneyTransferred[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Logs
export const getLogs = async (req, res) => {
  try {
    // Find logs for adding or removing users
    const logs = await Log.find({
      action_type: { $in: ['add_user', 'remove_user'] }
    }).sort({ created_at: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 