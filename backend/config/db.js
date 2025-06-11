const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Add these connection options to handle timeouts better
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    // Retry connection after 5 seconds
    console.log('Attempting to reconnect in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
