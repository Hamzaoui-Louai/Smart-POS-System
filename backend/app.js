import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import pharmacyOwnerRoutes from './routes/pharmacyOwnerRoutes.js';
import cashierRoutes from './routes/cashierRoutes.js';
import wholesalerRoutes from './routes/wholesalerRoutes.js';
import logisticsRoutes from './routes/logisticsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'
import socketManager from './socket/socketManager.js';
import './jobs/expirationAlertJob.js';
import cors from 'cors';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/pharmacy-owner', pharmacyOwnerRoutes);
app.use('/api/cashier', cashierRoutes);
app.use('/api/wholesaler', wholesalerRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/payment', paymentRoutes);


// Initialize Socket.IO
socketManager.initialize(server);

// MongoDB Atlas connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Connected to MongoDB Atlas');
// }).catch((err) => {
//   console.error('MongoDB connection error:', err);
// });

try {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'POS'
    // dbName:'test'
  })
  console.log('Connected to MongoDB Atlas');

} catch (err) {
  console.log('Error of Connection to DB', err)
}

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Socket.IO server initialized`);
});

export { app, server };
