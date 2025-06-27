import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class SocketManager {
  constructor() {
    this.io = null;
    this.userSockets = new Map(); // Map to store user ID -> socket ID
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`User ${socket.user.email} connected`);
      
      // Store user socket mapping
      this.userSockets.set(socket.user.id.toString(), socket.id);
      
      // Join user to their role-specific room
      socket.join(`role_${socket.user.role}`);
      
      // Join user to their specific room (for targeted notifications)
      socket.join(`user_${socket.user.id}`);

      socket.on('disconnect', () => {
        console.log(`User ${socket.user.email} disconnected`);
        this.userSockets.delete(socket.user.id.toString());
      });

      // Handle notification read events
      socket.on('mark_notification_read', async (notificationId) => {
        try {
          // This could trigger a database update if needed
          console.log(`User ${socket.user.email} marked notification ${notificationId} as read`);
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      });
    });
  }

  // Send notification to specific user
  sendNotificationToUser(userId, notification) {
    const socketId = this.userSockets.get(userId.toString());
    if (socketId) {
      this.io.to(socketId).emit('new_notification', notification);
    }
  }

  // Send notification to all users with specific role
  sendNotificationToRole(role, notification) {
    this.io.to(`role_${role}`).emit('new_notification', notification);
  }

  // Send notification to all connected users
  broadcastNotification(notification) {
    this.io.emit('new_notification', notification);
  }

  // Send notification to multiple specific users
  sendNotificationToUsers(userIds, notification) {
    userIds.forEach(userId => {
      this.sendNotificationToUser(userId, notification);
    });
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.userSockets.size;
  }

  // Check if user is connected
  isUserConnected(userId) {
    return this.userSockets.has(userId.toString());
  }
}

export default new SocketManager(); 