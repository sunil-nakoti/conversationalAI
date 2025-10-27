const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('[DB] Attempting to connect to MongoDB...');
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
