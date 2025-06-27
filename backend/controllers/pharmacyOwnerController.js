import Pharmacy from '../models/Pharmacy.js';
import Stock from '../models/Stock.js';
import Medicine from '../models/Medicine.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import PharmacyCashier from '../models/PharmacyCashier.js';
import User from '../models/User.js';
import Sale from '../models/Sale.js';
import SaleItem from '../models/SaleItem.js';
import notificationService from '../utils/notificationService.js';
import StockMovement from '../models/StockMovement.js';
import Log from '../models/Log.js';

// Manage pharmacy profile
export const updatePharmacyProfile = async (req, res) => {
  try {
    const { name, address, latitude, longitude, contact_info } = req.body;
    const pharmacy_id = req.user.pharmacy_id;
    
    if (!pharmacy_id) {
      return res.status(400).json({ message: 'Pharmacy ID not found for user.' });
    }
    
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      pharmacy_id,
      { name, address, latitude, longitude, contact_info },
      { new: true }
    );
    
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found.' });
    }
    
    res.json({ message: 'Pharmacy profile updated successfully.', pharmacy });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get pharmacy profile
export const getPharmacyProfile = async (req, res) => {
  try {
    const pharmacy_id = req.user.pharmacy_id;
    
    if (!pharmacy_id) {
      return res.status(400).json({ message: 'Pharmacy ID not found for user.' });
    }
    
    const pharmacy = await Pharmacy.findById(pharmacy_id);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found.' });
    }
    
    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Manage pharmacy stock
export const getPharmacyStock = async (req, res) => {
  try {
    const pharmacy_id = req.user.pharmacy_id;
    
    if (!pharmacy_id) {
      return res.status(400).json({ message: 'Pharmacy ID not found for user.' });
    }
    
    const stock = await Stock.find({ pharmacy_id })
      .populate('medicine_id', 'name barcode price_for_one price_for_quantity')
      .populate('supplier_id', 'name contact_info');
    
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update stock
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity, expiration_date } = req.body;
    const pharmacy_id = req.user.pharmacy_id;
    
    if (!pharmacy_id) {
      return res.status(400).json({ message: 'Pharmacy ID not found for user.' });
    }
    
    const stock = await Stock.findOneAndUpdate(
      { _id: id, pharmacy_id: pharmacy_id },
      { stock_quantity, expiration_date },
      { new: true }
    );
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found or not authorized.' });
    }
    
    res.json({ message: 'Stock updated successfully.', stock });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Assign cashiers to pharmacy
export const assignCashier = async (req, res) => {
  try {
    const { cashier_id } = req.body;
    const pharmacy_id = req.user.pharmacy_id;
    const assigned_by = req.user.id;
    
    if (!pharmacy_id) {
      return res.status(400).json({ message: 'Pharmacy ID not found for user.' });
    }
    
    // Check if cashier exists and has cashier role
    const cashier = await User.findById(cashier_id);
    if (!cashier || cashier.role !== 'cashier') {
      return res.status(400).json({ message: 'Invalid cashier ID or user is not a cashier.' });
    }
    
    // Check if already assigned
    const existingAssignment = await PharmacyCashier.findOne({
      pharmacy_id,
      cashier_id,
      is_active: true
    });
    
    if (existingAssignment) {
      return res.status(400).json({ message: 'Cashier is already assigned to this pharmacy.' });
    }
    
    const assignment = new PharmacyCashier({
      pharmacy_id,
      cashier_id,
      assigned_by
    });
    
    await assignment.save();
    
    res.status(201).json({ message: 'Cashier assigned successfully.', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get assigned cashiers
export const getAssignedCashiers = async (req, res) => {
  try {
    const pharmacy_id = req.user.pharmacy_id;
    
    if (!pharmacy_id) {
      return res.status(400).json({ message: 'Pharmacy ID not found for user.' });
    }
    
    const assignments = await PharmacyCashier.find({
      pharmacy_id,
      is_active: true
    })
    .populate('cashier_id', 'name email')
    .populate('assigned_by', 'name');
    
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Purchase from wholesalers
export const createPurchaseOrder = async (req, res) => {
  try {
    const { wholesaler_id, items, notes } = req.body;
    const pharmacy_id = req.user.pharmacy_id;
    
    if (!pharmacy_id) {
      return res.status(400).json({ message: 'Pharmacy ID not found for user.' });
    }
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required.' });
    }
    
    // Calculate totals
    let total_amount = 0;
    const processedItems = items.map(item => {
      const subtotal = item.quantity * item.unit_price;
      total_amount += subtotal;
      return {
        ...item,
        subtotal
      };
    });
    
    const purchaseOrder = new PurchaseOrder({
      pharmacy_id,
      wholesaler_id,
      items: processedItems,
      total_amount,
      notes
    });
    
    await purchaseOrder.save();
    
    // Send real-time notification to wholesaler
    await notificationService.notifyNewPurchaseOrder(purchaseOrder);
    
    res.status(201).json({ message: 'Purchase order created successfully.', purchaseOrder });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get purchase orders
export const getPurchaseOrders = async (req, res) => {
  try {
    const pharmacy_id = req.user.pharmacy_id;
    
    if (!pharmacy_id) {
      return res.status(400).json({ message: 'Pharmacy ID not found for user.' });
    }
    
    const purchaseOrders = await PurchaseOrder.find({ pharmacy_id })
      .populate('wholesaler_id', 'name email')
      .populate('items.medicine_id', 'name barcode')
      .populate('transport_request_id')
      .sort({ created_at: -1 });
    
    res.json(purchaseOrders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Track deliveries and orders
export const getDeliveries = async (req, res) => {
  try {
    const pharmacy_id = req.user.pharmacy_id;
    
    if (!pharmacy_id) {
      return res.status(400).json({ message: 'Pharmacy ID not found for user.' });
    }
    
    // Get purchase orders that are being delivered
    const purchaseOrders = await PurchaseOrder.find({
      pharmacy_id,
      status: { $in: ['processing', 'shipped'] }
    })
    .populate('wholesaler_id', 'name email')
    .populate('transport_request_id')
    .sort({ created_at: -1 });
    
    res.json(purchaseOrders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// View analytics dashboard
export const getAnalytics = async (req, res) => {
  try {
    const pharmacy_id = req.user.pharmacy_id;
    
    if (!pharmacy_id) {
      return res.status(400).json({ message: 'Pharmacy ID not found for user.' });
    }
    
    // Get date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Total sales in last 30 days
    const totalSales = await Sale.aggregate([
      {
        $match: {
          pharmacy_id: new mongoose.Types.ObjectId(pharmacy_id),
          created_at: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total_amount: { $sum: '$total_amount' },
          total_transactions: { $sum: 1 }
        }
      }
    ]);
    
    // Most sold medicines
    const mostSoldMedicines = await SaleItem.aggregate([
      {
        $lookup: {
          from: 'sales',
          localField: 'sale_id',
          foreignField: '_id',
          as: 'sale'
        }
      },
      {
        $unwind: '$sale'
      },
      {
        $match: {
          'sale.pharmacy_id': new mongoose.Types.ObjectId(pharmacy_id),
          'sale.created_at': { $gte: startDate, $lte: endDate }
        }
      },
      {
        $lookup: {
          from: 'stocks',
          localField: 'stock_id',
          foreignField: '_id',
          as: 'stock'
        }
      },
      {
        $unwind: '$stock'
      },
      {
        $lookup: {
          from: 'medicines',
          localField: 'stock.medicine_id',
          foreignField: '_id',
          as: 'medicine'
        }
      },
      {
        $unwind: '$medicine'
      },
      {
        $group: {
          _id: '$medicine._id',
          medicine_name: { $first: '$medicine.name' },
          total_quantity: { $sum: '$quantity' },
          total_revenue: { $sum: '$subtotal' }
        }
      },
      {
        $sort: { total_quantity: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    // Low stock alerts
    const lowStock = await Stock.find({
      pharmacy_id,
      stock_quantity: { $lt: 10 }
    })
    .populate('medicine_id', 'name barcode')
    .limit(10);
    
    // Expiring stock alerts (within 30 days)
    const expiringStock = await Stock.find({
      pharmacy_id,
      expiration_date: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    })
    .populate('medicine_id', 'name barcode')
    .limit(10);
    
    res.json({
      totalSales: totalSales[0] || { total_amount: 0, total_transactions: 0 },
      mostSoldMedicines,
      lowStock,
      expiringStock
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add stock movement (restock, correction, return)
export const addStockMovement = async (req, res) => {
  try {
    const { stock_id, change, reason } = req.body;
    const pharmacy_id = req.user.pharmacy_id;
    const user_id = req.user.id;
    if (!stock_id || !change || !reason) {
      return res.status(400).json({ message: 'stock_id, change, and reason are required.' });
    }
    // Find stock and ensure it belongs to this pharmacy
    const stock = await Stock.findOne({ _id: stock_id, pharmacy_id });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found or not authorized.' });
    }
    // Update stock quantity
    stock.stock_quantity += change;
    await stock.save();
    // Record stock movement
    const movement = new StockMovement({
      stock_id,
      user_id,
      change,
      reason
    });
    await movement.save();
    // Log the action
    await Log.create({
      actor_id: user_id,
      actor_role: req.user.role,
      entity_type: 'stock',
      entity_id: stock_id,
      action_type: 'stock_movement',
      description: `Stock movement (${reason}) of ${change} units for stock ${stock_id} by user ${req.user.email}`,
      ip_address: req.ip
    });
    res.status(201).json({ message: 'Stock movement recorded.', movement, stock });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get stock movements for pharmacy
export const getStockMovements = async (req, res) => {
  try {
    const pharmacy_id = req.user.pharmacy_id;
    // Find all stock for this pharmacy
    const stocks = await Stock.find({ pharmacy_id });
    const stockIds = stocks.map(s => s._id);
    // Find movements for these stocks
    const movements = await StockMovement.find({ stock_id: { $in: stockIds } })
      .populate('user_id', 'name email role')
      .populate('stock_id');
    res.json(movements);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 