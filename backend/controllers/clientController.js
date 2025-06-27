import Pharmacy from '../models/Pharmacy.js';
import Medicine from '../models/Medicine.js';
import Stock from '../models/Stock.js';
import RefillSuggestion from '../models/RefillSuggestion.js';

// View pharmacies and their locations
export const getPharmacies = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;
    
    let query = {};
    if (latitude && longitude) {
      // Convert radius from km to meters and find pharmacies within radius
      const radiusInMeters = radius * 1000;
      query = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: radiusInMeters
          }
        }
      };
    }
    
    const pharmacies = await Pharmacy.find(query);
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Search for medicines across pharmacies within 5km radius
export const searchMedicines = async (req, res) => {
  try {
    const { query, latitude, longitude, radius = 5 } = req.query;
    const client_id = req.user.id;
    
    if (!query || !latitude || !longitude) {
      return res.status(400).json({ message: 'Query, latitude, and longitude are required.' });
    }
    
    // Convert radius from km to meters
    const radiusInMeters = radius * 1000;
    
    // Find pharmacies within radius
    const nearbyPharmacies = await Pharmacy.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radiusInMeters
        }
      }
    });
    
    const pharmacyIds = nearbyPharmacies.map(p => p._id);
    
    // Search medicines by name or barcode
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { barcode: { $regex: query, $options: 'i' } }
      ]
    });
    
    const medicineIds = medicines.map(m => m._id);
    
    // Get stock for found medicines in nearby pharmacies
    const stock = await Stock.find({
      medicine_id: { $in: medicineIds },
      pharmacy_id: { $in: pharmacyIds }
    })
    .populate('medicine_id', 'name barcode price_for_one price_for_quantity')
    .populate('pharmacy_id', 'name address latitude longitude contact_info');
    
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// View medicine prices
export const getMedicinePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, radius = 5 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }
    
    // Convert radius from km to meters
    const radiusInMeters = radius * 1000;
    
    // Find pharmacies within radius
    const nearbyPharmacies = await Pharmacy.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radiusInMeters
        }
      }
    });
    
    const pharmacyIds = nearbyPharmacies.map(p => p._id);
    
    // Get stock for the specific medicine in nearby pharmacies
    const stock = await Stock.find({
      medicine_id: id,
      pharmacy_id: { $in: pharmacyIds }
    })
    .populate('medicine_id', 'name barcode price_for_one price_for_quantity')
    .populate('pharmacy_id', 'name address');
    
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get refill suggestions
export const getRefillSuggestions = async (req, res) => {
  try {
    const client_id = req.user.id;
    
    const suggestions = await RefillSuggestion.find({ client_id })
      .populate('stock_id')
      .sort({ estimated_next_refill_date: 1 });
    
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 