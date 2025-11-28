const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const plivo = require('plivo');
const connectDB = require('./config/db');
const { setupPlivoSocket } = require('./services/streamService');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Validate ENV variables to prevent runtime errors
if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.API_KEY) {
    console.error('FATAL ERROR: Make sure MONGO_URI, JWT_SECRET, and API_KEY are defined in your backend/config/config.env file.');
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

    // --- TEMPORARY SCRIPT TO FIX DATABASE --- 
    // This will run once to remove the corrupted unique index on the 'id' field.
    try {
        const mongoose = require('mongoose');
        const db = mongoose.connection;
        const collection = db.collection('objections');
        const indexExists = await collection.indexExists('id_1');
        if (indexExists) {
            console.log('[DB Repair] Found corrupted index `id_1`. Dropping it now...');
            await collection.dropIndex('id_1');
            console.log('[DB Repair] Successfully dropped corrupted index.');
        } else {
            console.log('[DB Repair] Corrupted index `id_1` not found. No action needed.');
        }
    } catch (err) {
        console.error('[DB Repair] CRITICAL: Failed to drop corrupted index. Please intervene manually.', err);
        process.exit(1); // Exit if we can't repair the DB
    }
    // --- END TEMPORATORY SCRIPT ---

    // --- TEMPORARY SCRIPT 2 TO FIX DATABASE ---
    // This will run once to remove the corrupted unique index on the 'id' field from the smstemplates collection.
    try {
        const mongoose = require('mongoose');
        const db = mongoose.connection;
        const collection = db.collection('smstemplates');
        const indexExists = await collection.indexExists('id_1');
        if (indexExists) {
            console.log('[DB Repair] Found corrupted index `id_1` on smstemplates. Dropping it now...');
            await collection.dropIndex('id_1');
            console.log('[DB Repair] Successfully dropped corrupted index from smstemplates.');
        } else {
            console.log('[DB Repair] Corrupted index `id_1` on smstemplates not found. No action needed.');
        }
    } catch (err) {
        console.error('[DB Repair] CRITICAL: Failed to drop corrupted index from smstemplates. Please intervene manually.', err);
        process.exit(1); // Exit if we can't repair the DB
    }
    // --- END TEMPORARY SCRIPT 2 ---

    // Route files
    console.log('[Server] Loading routes...');
    const auth = require('./routes/authRoutes');
    const agents = require('./routes/agentRoutes');
    const portfolios = require('./routes/portfolioRoutes');
    const dashboard = require('./routes/dashboardRoutes');
    const intelligence = require('./routes/intelligenceRoutes');
    const compliance = require('./routes/complianceRoutes');
    const live = require('./routes/liveRoutes');
    const settings = require('./routes/settingsRoutes');
    const reports = require('./routes/reportingRoutes');
    const notifications = require('./routes/notificationRoutes');
    const chatbot = require('./routes/chatbotRoutes');
    const users = require('./routes/userRoutes');

    // Mount routers
    app.use('/api/auth', auth);
    app.use('/api/agents', agents);
    app.use('/api/portfolios', portfolios);
    app.use('/api/dashboard', dashboard);
    app.use('/api/intelligence', intelligence);
    app.use('/api/compliance', compliance);
    app.use('/api/live', live);
    app.use('/api/settings', settings);
    app.use('/api/reports', reports);
    app.use('/api/notifications', notifications);
    app.use('/api/chatbot', chatbot);
    app.use('/api/users', users);

    // Plivo Webhook for Incoming/Outbound Calls
    app.all('/api/plivo-xml', (req, res) => {
        const response = new plivo.Response();
        
        // Configure Stream for "Linear PCM 8000Hz" (audio/x-l16)
        response.addStream(
            'wss://your-public-domain.com/streams/plivo', 
            {
                bidirectional: true,
                audioTrack: "inbound",
                streamTimeout: 86400,
                keepCallAlive: true,
                contentType: "audio/x-l16;rate=8000" // CRITICAL SETTING
            }
        );

        res.set('Content-Type', 'text/xml');
        res.send(response.toXML());
    });

    const PORT = process.env.PORT || 5000;

    const server = http.createServer(app);
    setupPlivoSocket(server);


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
