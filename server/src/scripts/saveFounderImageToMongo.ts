import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { SiteSettings } from '../models/SiteSettings.js';
import { connectDatabase } from '../config/database.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });
}

async function run() {
  console.log('🔄 Loading founder image and preparing MongoDB upload...');
  
  // Try several candidate paths for the image
  const candidatePaths = [
    path.join(process.cwd(), 'uploads', 'founder.jpg'),
    path.join(process.cwd(), 'server', 'uploads', 'founder.jpg'),
    path.join(process.cwd(), 'client', 'public', 'founder.jpg'),
  ];

  let imagePath = '';
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      imagePath = p;
      break;
    }
  }

  if (!imagePath) {
    console.error('❌ Could not locate founder image file.');
    process.exit(1);
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  console.log(`📸 Image loaded (${imageBuffer.length} bytes, base64 length: ${base64Image.length})`);

  console.log('📡 Connecting to MongoDB...');
  await connectDatabase();

  if (mongoose.connection.readyState !== 1) {
    console.error('❌ MongoDB is not connected.');
    process.exit(1);
  }

  console.log('💾 Saving founder image to MongoDB in SiteSettings collection...');
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings({
      companyName: 'Banashankari Enterprises',
      founderName: 'Ramesh S H',
      founderTitle: 'Founder & Managing Director',
      founderPhoto: base64Image,
    });
  } else {
    settings.founderPhoto = base64Image;
    if (!settings.founderTitle) {
      settings.founderTitle = 'Founder & Managing Director';
    }
  }

  await settings.save();
  console.log('✅ Successfully saved founder image into MongoDB SiteSettings!');
  console.log(`Document ID: ${settings._id}`);
  console.log(`Founder Photo prefix: ${settings.founderPhoto?.substring(0, 50)}...`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB. Done!');
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error saving founder image to MongoDB:', err);
  process.exit(1);
});

