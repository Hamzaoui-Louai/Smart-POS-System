import WholesalerStock from '../models/WholesalerStock.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import TransportRequest from '../models/TransportRequest.js';
import Notification from '../models/Notification.js';
import Medicine from '../models/Medicine.js';
import Supplier from '../models/Supplier.js';
import Pharmacy from '../models/Pharmacy.js';
import notificationService from '../utils/notificationService.js';
import mongoose from 'mongoose'
import StockMovement from '../models/StockMovement.js';
import Log from '../models/Log.js';

// Manage own medicine stock
export const getStock = async (req, res) => {
  try {
    const wholesaler_id = req.user.id;
    
    const stock = await WholesalerStock.find({ wholesaler_id })
      .populate('medicine_id', 'name barcode')
      .populate('supplier_id', 'name contact_info')
      .sort({ created_at: -1 });
    
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update stock
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, unit_price, is_available, expiration_date } = req.body;
    const wholesaler_id = req.user.id;
    
    const stock = await WholesalerStock.findOneAndUpdate(
      { _id: id, wholesaler_id: wholesaler_id },
      { quantity, unit_price, is_available, expiration_date },
      { new: true }
    ).populate('medicine_id', 'name');
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found or not authorized.' });
    }
    
    // Check for low stock and send notification
    if (quantity < 20) {
      await notificationService.notifyLowStock(
        wholesaler_id,
        stock.medicine_id.name,
        quantity
      );
    }
    
    // Check for expiring stock and send notification
    if (expiration_date && new Date(expiration_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
      await notificationService.notifyExpiringStock(
        wholesaler_id,
        stock.medicine_id.name,
        expiration_date
      );
    }
    
    res.json({ message: 'Stock updated successfully.', stock });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add new stock
export const addStock = async (req, res) => {
  try {
    const {
      medicine_id,
      quantity,
      unit_price,
      supplier_id,
      batch_number,
      expiration_date
    } = req.body;
    const wholesaler_id = req.user.id;
    
    if (!medicine_id || !quantity || !unit_price || !supplier_id || !expiration_date) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }
    
    const stock = new WholesalerStock({
      wholesaler_id,
      medicine_id,
      quantity,
      unit_price,
      supplier_id,
      batch_number,
      expiration_date
    });
    
    await stock.save();
    
    res.status(201).json({ message: 'Stock added successfully.', stock });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Receive purchase requests from pharmacies
export const getPurchaseRequests = async (req, res) => {
  try {
    const wholesaler_id = req.user.id;
    
    const purchaseRequests = await PurchaseOrder.find({ wholesaler_id })
      .populate('pharmacy_id', 'name address contact_info')
      .populate('items.medicine_id', 'name barcode')
      .populate('transport_request_id')
      .sort({ created_at: -1 });
    
    res.json(purchaseRequests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update purchase order status
export const updatePurchaseOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const wholesaler_id = req.user.id;
    
    const purchaseOrder = await PurchaseOrder.findOneAndUpdate(
      { _id: id, wholesaler_id: wholesaler_id },
      { status, notes },
      { new: true }
    ).populate('pharmacy_id', 'name');
    
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found or not authorized.' });
    }
    
    // Send real-time notification to pharmacy owner
    await notificationService.notifyDeliveryUpdate(
      purchaseOrder.pharmacy_id._id,
      purchaseOrder._id,
      status
    );
    
    res.json({ message: 'Purchase order status updated successfully.', purchaseOrder });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create logistics requests for deliveries
export const createLogisticsRequest = async (req, res) => {
  try {
    const {
      purchase_order_id,
      logistics_company_id,
      transport_fee,
      estimated_delivery_date,
      notes
    } = req.body;
    const wholesaler_id = req.user.id;
    
    if (!purchase_order_id || !logistics_company_id || !transport_fee) {
      return res.status(400).json({ message: 'Purchase order ID, logistics company ID, and transport fee are required.' });
    }
    
    // Get purchase order details
    const purchaseOrder = await PurchaseOrder.findById(purchase_order_id);
    if (!purchaseOrder || purchaseOrder.wholesaler_id.toString() !== wholesaler_id) {
      return res.status(404).json({ message: 'Purchase order not found or not authorized.' });
    }
    
    // Create transport request
    const transportRequest = new TransportRequest({
      wholesaler_id,
      logistics_company_id,
      destination_pharmacy_id: purchaseOrder.pharmacy_id,
      items: purchaseOrder.items,
      total_amount: purchaseOrder.total_amount,
      transport_fee,
      estimated_delivery_date,
      notes
    });
    
    await transportRequest.save();
    
    // Update purchase order with transport request
    await PurchaseOrder.findByIdAndUpdate(purchase_order_id, {
      transport_request_id: transportRequest._id,
      status: 'processing'
    });
    
    // Send real-time notification to logistics company
    await notificationService.notifyTransportRequest(logistics_company_id, transportRequest);
    
    res.status(201).json({ message: 'Logistics request created successfully.', transportRequest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get notifications
export const getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { is_read } = req.query;
    
    let query = { user_id };
    if (is_read !== undefined) {
      query.is_read = is_read === 'true';
    }
    
    const notifications = await Notification.find(query)
      .sort({ created_at: -1 })
      .limit(50);
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user_id: user_id },
      { is_read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or not authorized.' });
    }
    
    res.json({ message: 'Notification marked as read.', notification });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    await Notification.updateMany(
      { user_id, is_read: false },
      { is_read: true }
    );
    
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get wholesaler dashboard analytics
export const getDashboard = async (req, res) => {
  try {
    const wholesaler_id = req.user.id;
    
    // Get date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Total orders in last 30 days
    const totalOrders = await PurchaseOrder.aggregate([
      {
        $match: {
          wholesaler_id: new mongoose.Types.ObjectId(wholesaler_id),
          created_at: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total_orders: { $sum: 1 },
          total_revenue: { $sum: '$total_amount' }
        }
      }
    ]);
    
    // Low stock alerts
    const lowStock = await WholesalerStock.find({
      wholesaler_id,
      quantity: { $lt: 20 },
      is_available: true
    })
    .populate('medicine_id', 'name barcode')
    .limit(10);
    
    // Expiring stock alerts (within 30 days)
    const expiringStock = await WholesalerStock.find({
      wholesaler_id,
      expiration_date: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      is_available: true
    })
    .populate('medicine_id', 'name barcode')
    .limit(10);
    
    // Pending orders
    const pendingOrders = await PurchaseOrder.countDocuments({
      wholesaler_id,
      status: 'pending'
    });
    
    res.json({
      totalOrders: totalOrders[0] || { total_orders: 0, total_revenue: 0 },
      lowStock,
      expiringStock,
      pendingOrders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add stock movement (restock, correction, return) for wholesaler
export const addStockMovement = async (req, res) => {
  try {
    const { stock_id, change, reason } = req.body;
    const wholesaler_id = req.user.id;
    if (!stock_id || !change || !reason) {
      return res.status(400).json({ message: 'stock_id, change, and reason are required.' });
    }
    // Find stock and ensure it belongs to this wholesaler
    const stock = await WholesalerStock.findOne({ _id: stock_id, wholesaler_id });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found or not authorized.' });
    }
    // Update stock quantity
    stock.quantity += change;
    await stock.save();
    // Record stock movement
    const movement = new StockMovement({
      stock_id,
      user_id: wholesaler_id,
      change,
      reason
    });
    await movement.save();
    // Log the action
    await Log.create({
      actor_id: wholesaler_id,
      actor_role: req.user.role,
      entity_type: 'wholesaler_stock',
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

// Get stock movements for wholesaler
export const getStockMovements = async (req, res) => {
  try {
    const wholesaler_id = req.user.id;
    // Find all stock for this wholesaler
    const stocks = await WholesalerStock.find({ wholesaler_id });
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