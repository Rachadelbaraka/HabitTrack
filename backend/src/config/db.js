import mongoose from 'mongoose';

let databaseReady = false;

export const connectDB = async () => {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    console.warn('MONGODB_URI is missing. Starting API without a database connection.');
    databaseReady = false;
    return false;
  }

  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000
    });

    databaseReady = true;
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    databaseReady = false;
    console.warn(`MongoDB unavailable, frontend fallback can be used: ${error.message}`);
    return false;
  }
};

export const isDatabaseReady = () => databaseReady && mongoose.connection.readyState === 1;
