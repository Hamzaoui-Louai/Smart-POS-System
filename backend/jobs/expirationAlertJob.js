import cron from 'node-cron';
import Stock from '../models/Stock.js';
import WholesalerStock from '../models/WholesalerStock.js';
import ExpirationAlert from '../models/ExpirationAlert.js';
import User from '../models/User.js';
import notificationService from '../utils/notificationService.js';

// Helper to determine severity
function getSeverity(daysLeft) {
  if (daysLeft < 7) return 'critical';
  if (daysLeft < 30) return 'warning';
  return 'info';
}

// Helper to get responsible user for pharmacy stock
async function getPharmacyOwner(pharmacy_id) {
  return await User.findOne({ pharmacy_id, role: 'pharmacy_owner' });
}

// Helper to get responsible user for wholesaler stock
async function getWholesalerUser(wholesaler_id) {
  return await User.findOne({ _id: wholesaler_id, role: 'wholesaler' });
}

// Main job function
async function checkExpirations() {
  const now = new Date();
  // Check pharmacy stock
  const pharmacyStocks = await Stock.find();
  for (const stock of pharmacyStocks) {
    if (!stock.expiration_date) continue;
    const daysLeft = Math.ceil((stock.expiration_date - now) / (1000 * 60 * 60 * 24));
    if (daysLeft > 60) continue; // Only alert for items expiring within 60 days
    const severity = getSeverity(daysLeft);
    // Check if alert already exists for this stock and severity
    const existing = await ExpirationAlert.findOne({ stock_id: stock._id, severity_level: severity });
    if (!existing) {
      // Find pharmacy owner
      const owner = await getPharmacyOwner(stock.pharmacy_id);
      const alert = new ExpirationAlert({
        stock_id: stock._id,
        alert_date: now,
        severity_level: severity,
        notified: false,
        user_id: owner ? owner._id : null,
        created_at: now
      });
      await alert.save();
      // Send notification for critical alerts
      if (severity === 'critical' && owner) {
        await notificationService.createNotification(
          owner._id,
          'Critical Expiration Alert',
          `Stock item is expiring in ${daysLeft} days!`,
          'expiring_stock',
          'stock',
          stock._id
        );
      }
    }
  }
  // Check wholesaler stock
  const wholesalerStocks = await WholesalerStock.find();
  for (const stock of wholesalerStocks) {
    if (!stock.expiration_date) continue;
    const daysLeft = Math.ceil((stock.expiration_date - now) / (1000 * 60 * 60 * 24));
    if (daysLeft > 60) continue;
    const severity = getSeverity(daysLeft);
    const existing = await ExpirationAlert.findOne({ stock_id: stock._id, severity_level: severity });
    if (!existing) {
      // Find wholesaler user
      const user = await getWholesalerUser(stock.wholesaler_id);
      const alert = new ExpirationAlert({
        stock_id: stock._id,
        alert_date: now,
        severity_level: severity,
        notified: false,
        user_id: user ? user._id : null,
        created_at: now
      });
      await alert.save();
      if (severity === 'critical' && user) {
        await notificationService.createNotification(
          user._id,
          'Critical Expiration Alert',
          `Stock item is expiring in ${daysLeft} days!`,
          'expiring_stock',
          'stock',
          stock._id
        );
      }
    }
  }
}

// Schedule the job to run every day at 2am
cron.schedule('0 2 * * *', checkExpirations);

// Export for manual triggering/testing
export default checkExpirations; 