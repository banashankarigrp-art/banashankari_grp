import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export const connectDatabase = async (): Promise<boolean> => {
  if (isConnected) {
    return true;
  }

  try {
    mongoose.set('strictQuery', true);
    
    // Setup connection event listeners
    mongoose.connection.on('connected', () => {
      isConnected = true;
      console.log('✅ MongoDB connected successfully to:', mongoose.connection.host);
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('⚠️ MongoDB disconnected.');
    });

    console.log(`📡 Connecting to MongoDB at ${ENV.MONGODB_URI.split('@').pop() || ENV.MONGODB_URI}...`);
    
    // Attempt connection with reasonable timeout
    await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000,
    });

    isConnected = true;
    return true;
  } catch (error: any) {
    console.warn('\n⚠️ [NOTICE] MongoDB connection could not be established immediately:');
    console.warn(`   Reason: ${error.message}`);
    console.warn('   The server will continue running. Once you configure your MongoDB Atlas URI in server/.env, it will automatically connect on restart.\n');
    isConnected = false;
    return false;
  }
};

export const getDbConnectionStatus = () => ({
  isConnected: mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || 'none',
  dbName: mongoose.connection.name || 'none'
});
