const mongoose = require('mongoose');

let isConnected = false;

async function connectDB(uri) {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gym_app';

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB at:', mongoUri);
    return mongoose.connection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Please make sure MongoDB is running on your system');
    isConnected = false;
    throw err;
  }
}

module.exports = connectDB;

