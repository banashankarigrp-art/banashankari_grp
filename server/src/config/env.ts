import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/banashankari',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'banashankari_dev_access_secret_key_8923',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'banashankari_dev_refresh_secret_key_9934',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  INITIAL_ADMIN_EMAIL: process.env.INITIAL_ADMIN_EMAIL || 'admin@banashankarienterprises.com',
  INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD || 'Admin@Bana2025Secure',
  INITIAL_ADMIN_NAME: process.env.INITIAL_ADMIN_NAME || 'Ramesh S H (Admin)',
  INITIAL_ADMIN_PHONE: process.env.INITIAL_ADMIN_PHONE || '+91 997 253 6991',
};
