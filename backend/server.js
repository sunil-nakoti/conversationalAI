const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Validate ENV variables to prevent runtime errors
if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.API_KEY || !process.env.STRIPE_SECRET_KEY) {
    console.error('FATAL ERROR: Make sure MONGO_URI, JWT_SECRET, API_KEY, and STRIPE_SECRET_KEY are defined in your backend/config/config.env file.');
    process.exit(1);
}

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

console.log('[Server] Starting server...');
const startServer = async () => {
  let listeningServer;
  try {
    console.log('[Server] Connecting to database...');
    // Connect to database
    await connectDB();
    console.log('[Server] Database connected.');

    // Route files
    console.log('[Server] Loading routes...');
    const auth = require('./routes/authRoutes');
    const users = require('./routes/userRoutes');
    const business = require('./routes/businessRoutes');
    const payments = require('./routes/paymentRoutes');

    // Mount routers
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/business', business);
    app.use('/api/payments', payments);


    const PORT = process.env.PORT || 5000;

    const server = http.createServer(app);


    listeningServer = server.listen(
      PORT,
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
    );

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log(`Error: ${err.message}`);
      // Close server & exit process
      if (listeningServer) {
          listeningServer.close(() => process.exit(1));
      } else {
          process.exit(1);
      }
    });

  } catch (error) {
    console.error('[Server] FATAL: Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
