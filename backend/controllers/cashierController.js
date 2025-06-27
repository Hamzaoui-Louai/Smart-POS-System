import Stock from '../models/Stock.js';
import Medicine from '../models/Medicine.js';
import Sale from '../models/Sale.js';
import SaleItem from '../models/SaleItem.js';
import Pharmacy from '../models/Pharmacy.js';

// View pharmacy stock
export const getStock = async (req, res) => {
  try {
    const { pharmacy_id } = req.query;
    if (!pharmacy_id) {
      return res.status(400).json({ message: 'Pharmacy ID is required.' });
    }
    
    // Get stock with medicine details
    const stock = await Stock.find({ pharmacy_id })
      .populate('medicine_id', 'name barcode price_for_one price_for_quantity')
      .populate('supplier_id', 'name');
    
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Search stock by medicine name or barcode
export const searchStock = async (req, res) => {
  try {
    const { query, pharmacy_id } = req.query;
    if (!query || !pharmacy_id) {
      return res.status(400).json({ message: 'Query and pharmacy ID are required.' });
    }
    
    // Search medicines by name or barcode
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { barcode: { $regex: query, $options: 'i' } }
      ]
    });
    
    const medicineIds = medicines.map(m => m._id);
    
    // Get stock for found medicines
    const stock = await Stock.find({
      medicine_id: { $in: medicineIds },
      pharmacy_id: pharmacy_id
    }).populate('medicine_id', 'name barcode price_for_one price_for_quantity');
    
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Record a sale
export const recordSale = async (req, res) => {
  try {
    const { pharmacy_id, client_id, items, discount_amount = 0 } = req.body;
    const cashier_id = req.user.id;
    
    if (!pharmacy_id || !items || items.length === 0) {
      return res.status(400).json({ message: 'Pharmacy ID and items are required.' });
    }
    
    // Calculate total amount
    let total_amount = 0;
    for (const item of items) {
      const stock = await Stock.findById(item.stock_id);
      if (!stock) {
        return res.status(400).json({ message: `Stock with ID ${item.stock_id} not found.` });
      }
      if (stock.stock_quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for item ${item.stock_id}.` });
      }
      total_amount += item.unit_price * item.quantity;
    }
    
    // Apply discount
    total_amount -= discount_amount;
    
    // Create sale record
    const sale = new Sale({
      cashier_id,
      pharmacy_id,
      client_id,
      total_amount,
      discount_amount
    });
    await sale.save();
    
    // Create sale items and update stock
    for (const item of items) {
      // Create sale item
      const saleItem = new SaleItem({
        sale_id: sale._id,
        stock_id: item.stock_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.unit_price * item.quantity
      });
      await saleItem.save();
      
      // Update stock quantity
      await Stock.findByIdAndUpdate(item.stock_id, {
        $inc: { stock_quantity: -item.quantity }
      });
    }
    
    res.status(201).json({
      message: 'Sale recorded successfully.',
      sale: {
        id: sale._id,
        total_amount: sale.total_amount,
        discount_amount: sale.discount_amount,
        created_at: sale.created_at
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 