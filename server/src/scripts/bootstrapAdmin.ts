import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { connectDatabase } from '../config/database.js';
import { ENV } from '../config/env.js';

const bootstrapAdmin = async () => {
  console.log('--- Banashankari Enterprises Admin Bootstrap ---');
  await connectDatabase();

  if (mongoose.connection.readyState !== 1) {
    console.error('❌ Cannot bootstrap admin: MongoDB is not connected.');
    console.log('Please ensure your MONGODB_URI in server/.env is active.');
    process.exit(1);
  }

  const existingAdmin = await User.findOne({ email: ENV.INITIAL_ADMIN_EMAIL.toLowerCase() });

  if (existingAdmin) {
    console.log(`ℹ️ Admin user already exists: ${existingAdmin.email} (Role: ${existingAdmin.role})`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(ENV.INITIAL_ADMIN_PASSWORD, 12);

  const admin = await User.create({
    name: ENV.INITIAL_ADMIN_NAME,
    email: ENV.INITIAL_ADMIN_EMAIL.toLowerCase(),
    phone: ENV.INITIAL_ADMIN_PHONE,
    passwordHash,
    role: 'admin',
    accountStatus: 'active',
    emailVerified: true,
  });

  console.log('✅ Administrator account created successfully:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name:  ${admin.name}`);
  console.log(`   Phone: ${admin.phone}`);
  console.log(`   Role:  ${admin.role}`);
  console.log('⚠️ Please change your default password upon first login at /admin/login');

  await mongoose.disconnect();
  process.exit(0);
};

bootstrapAdmin().catch((err) => {
  console.error('Admin bootstrap error:', err);
  process.exit(1);
});
