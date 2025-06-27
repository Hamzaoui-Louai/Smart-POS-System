import TransportRequest from '../models/TransportRequest.js';
import Truck from '../models/Truck.js';
import Delivery from '../models/Delivery.js';
import LogisticsCenter from '../models/LogisticsCenter.js';
import notificationService from '../utils/notificationService.js';

// Receive transport requests from wholesalers
export const getTransportRequests = async (req, res) => {
  try {
    const logistics_company_id = req.user.logistics_company_id;
    
    const transportRequests = await TransportRequest.find({
      logistics_company_id: logistics_company_id
    })
    .populate('wholesaler_id', 'name email')
    .populate('destination_pharmacy_id', 'name address')
    .populate('items.medicine_id', 'name')
    .sort({ created_at: -1 });
    
    res.json(transportRequests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Set available trucks and their prices
export const addTruck = async (req, res) => {
  try {
    const {
      truck_number,
      capacity,
      base_price_per_km,
      driver_name,
      driver_contact,
      current_location
    } = req.body;
    
    const logistics_company_id = req.user.logistics_company_id;
    
    if (!truck_number || !capacity || !base_price_per_km) {
      return res.status(400).json({ message: 'Truck number, capacity, and base price are required.' });
    }
    
    const truck = new Truck({
      logistics_company_id,
      truck_number,
      capacity,
      base_price_per_km,
      driver_name,
      driver_contact,
      current_location
    });
    
    await truck.save();
    res.status(201).json({ message: 'Truck added successfully.', truck });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all trucks for the logistics company
export const getTrucks = async (req, res) => {
  try {
    const logistics_company_id = req.user.logistics_company_id;
    
    const trucks = await Truck.find({ logistics_company_id });
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Track deliveries
export const getDeliveries = async (req, res) => {
  try {
    const logistics_company_id = req.user.logistics_company_id;
    
    const deliveries = await Delivery.find()
      .populate({
        path: 'transport_request_id',
        match: { logistics_company_id: logistics_company_id },
        populate: [
          { path: 'wholesaler_id', select: 'name email' },
          { path: 'destination_pharmacy_id', select: 'name address' }
        ]
      })
      .populate('truck_id', 'truck_number driver_name')
      .populate('driver_id', 'name')
      .sort({ created_at: -1 });
    
    // Filter out deliveries where transport_request_id is null (due to match)
    const filteredDeliveries = deliveries.filter(delivery => delivery.transport_request_id);
    
    res.json(filteredDeliveries);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Send delivery confirmations
export const confirmDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found.' });
    }
    
    // Update delivery status and confirmation date
    delivery.status = 'confirmed';
    delivery.confirmation_date = new Date();
    delivery.notes = notes;
    await delivery.save();
    
    // Update transport request status
    const transportRequest = await TransportRequest.findByIdAndUpdate(delivery.transport_request_id, {
      status: 'delivered',
      actual_delivery_date: new Date()
    });
    
    // Send real-time notifications to wholesaler and pharmacy owner
    await notificationService.notifyDeliveryConfirmation(transportRequest);
    
    res.json({ message: 'Delivery confirmed successfully.', delivery });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found.' });
    }
    
    delivery.status = status;
    delivery.notes = notes;
    
    // Update relevant dates based on status
    if (status === 'picked_up') {
      delivery.pickup_date = new Date();
    } else if (status === 'delivered') {
      delivery.delivery_date = new Date();
    }
    
    await delivery.save();
    
    res.json({ message: 'Delivery status updated successfully.', delivery });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 