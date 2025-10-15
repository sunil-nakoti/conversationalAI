const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Validate ENV variables to prevent runtime errors
if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.API_KEY) {
    console.error('FATAL ERROR: Make sure MONGO_URI, JWT_SECRET, and API_KEY are defined in your backend/config/config.env file.');
    process.exit(1);
}

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
app.use('/api/agents', require('./routes/agentRoutes'));
app.use('/api/compliance', require('./routes/complianceRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/intelligence', require('./routes/intelligenceRoutes'));
app.use('/api/reporting', require('./routes/reportingRoutes'));
app.use('/api/live', require('./routes/liveRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));


const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
