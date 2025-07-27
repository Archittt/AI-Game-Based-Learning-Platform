const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async (retries = 3, delay = 3000) => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('MongoDB connection error: MONGO_URI is not defined in .env');
    process.exit(1);
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected successfully');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed:`, error.message);
      if (attempt === retries) {
        console.error('MongoDB connection failed after all retries');
        process.exit(1);
      }
      console.log(`Retrying connection in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;
