import Notification from '../models/Notification.js';
import socketManager from '../socket/socketManager.js';

class NotificationService {
  // Create and send notification to specific user
  async createNotification(userId, title, message, type, entityType = null, entityId = null) {
    try {
      const notification = new Notification({
        user_id: userId,
        title,
        message,
        type,
        entity_type: entityType,
        entity_id: entityId
      });

      await notification.save();

      // Send real-time notification
      socketManager.sendNotificationToUser(userId, notification);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create notification for new purchase order (for wholesalers)
  async notifyNewPurchaseOrder(purchaseOrder) {
    try {
      const notification = await this.createNotification(
        purchaseOrder.wholesaler_id,
        'New Purchase Order',
        `New purchase order received from pharmacy for $${purchaseOrder.total_amount}`,
        'new_order',
        'purchase_order',
        purchaseOrder._id
      );

      return notification;
    } catch (error) {
      console.error('Error notifying new purchase order:', error);
    }
  }

  // Create notification for low stock (for wholesalers)
  async notifyLowStock(wholesalerId, medicineName, currentQuantity) {
    try {
      const notification = await this.createNotification(
        wholesalerId,
        'Low Stock Alert',
        `Medicine ${medicineName} is running low (${currentQuantity} units remaining)`,
        'low_stock',
        'stock'
      );

      return notification;
    } catch (error) {
      console.error('Error notifying low stock:', error);
    }
  }

  // Create notification for expiring stock (for wholesalers)
  async notifyExpiringStock(wholesalerId, medicineName, expirationDate) {
    try {
      const notification = await this.createNotification(
        wholesalerId,
        'Expiring Stock Alert',
        `Medicine ${medicineName} expires on ${expirationDate.toLocaleDateString()}`,
        'expiring_stock',
        'stock'
      );

      return notification;
    } catch (error) {
      console.error('Error notifying expiring stock:', error);
    }
  }

  // Create notification for delivery updates (for pharmacy owners)
  async notifyDeliveryUpdate(pharmacyId, purchaseOrderId, status) {
    try {
      const notification = await this.createNotification(
        pharmacyId,
        'Delivery Update',
        `Your purchase order #${purchaseOrderId} status updated to: ${status}`,
        'delivery_update',
        'purchase_order',
        purchaseOrderId
      );

      return notification;
    } catch (error) {
      console.error('Error notifying delivery update:', error);
    }
  }

  // Create notification for transport request (for logistics)
  async notifyTransportRequest(logisticsCompanyId, transportRequest) {
    try {
      const notification = await this.createNotification(
        logisticsCompanyId,
        'New Transport Request',
        `New transport request received for delivery to pharmacy`,
        'new_order',
        'transport_request',
        transportRequest._id
      );

      return notification;
    } catch (error) {
      console.error('Error notifying transport request:', error);
    }
  }

  // Create notification for delivery confirmation (for wholesalers and pharmacy owners)
  async notifyDeliveryConfirmation(transportRequest) {
    try {
      // Notify wholesaler
      await this.createNotification(
        transportRequest.wholesaler_id,
        'Delivery Confirmed',
        `Delivery to pharmacy has been confirmed`,
        'delivery_update',
        'transport_request',
        transportRequest._id
      );

      // Notify pharmacy owner
      await this.createNotification(
        transportRequest.destination_pharmacy_id,
        'Delivery Confirmed',
        `Your order has been delivered and confirmed`,
        'delivery_update',
        'transport_request',
        transportRequest._id
      );
    } catch (error) {
      console.error('Error notifying delivery confirmation:', error);
    }
  }

  // Create notification for system events
  async notifySystemEvent(userId, title, message) {
    try {
      const notification = await this.createNotification(
        userId,
        title,
        message,
        'system'
      );

      return notification;
    } catch (error) {
      console.error('Error creating system notification:', error);
    }
  }

  // Bulk notification for role-based events
  async notifyRole(role, title, message, type = 'system') {
    try {
      // This would typically query users by role and send notifications
      // For now, we'll broadcast to the role room
      const notification = {
        title,
        message,
        type,
        created_at: new Date()
      };

      socketManager.sendNotificationToRole(role, notification);
    } catch (error) {
      console.error('Error notifying role:', error);
    }
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user_id: userId },
        { is_read: true },
        { new: true }
      );

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for user
  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { user_id: userId, is_read: false },
        { is_read: true }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

export default new NotificationService(); 