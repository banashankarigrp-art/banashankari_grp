import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Property } from '../models/Property.js';
import { ConstructionProject } from '../models/ConstructionProject.js';
import { Testimonial } from '../models/Testimonial.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { connectDatabase } from '../config/database.js';
import { ENV } from '../config/env.js';
import { INITIAL_PROPERTIES, INITIAL_PROJECTS, INITIAL_TESTIMONIALS } from '../services/store.js';

const seedDatabase = async () => {
  console.log('🌱 Seeding MongoDB Database for Banashankari Enterprises...');
  await connectDatabase();

  if (mongoose.connection.readyState !== 1) {
    console.error('❌ Cannot seed database: MongoDB connection not established.');
    console.log('Please check your MONGODB_URI in server/.env');
    process.exit(1);
  }

  // 1. Ensure Admin User
  let admin = await User.findOne({ email: ENV.INITIAL_ADMIN_EMAIL.toLowerCase() });
  if (!admin) {
    const passwordHash = await bcrypt.hash(ENV.INITIAL_ADMIN_PASSWORD, 12);
    admin = await User.create({
      name: ENV.INITIAL_ADMIN_NAME,
      email: ENV.INITIAL_ADMIN_EMAIL.toLowerCase(),
      phone: ENV.INITIAL_ADMIN_PHONE,
      passwordHash,
      role: 'admin',
      accountStatus: 'active',
      emailVerified: true,
    });
    console.log(`✅ Admin account created: ${admin.email}`);
  }

  // 2. Seed Properties
  const propCount = await Property.countDocuments();
  if (propCount === 0) {
    const propertiesToInsert = INITIAL_PROPERTIES.map((p) => {
      const { _id, ...rest } = p;
      return {
        ...rest,
        ownerId: admin._id,
      };
    });

    await Property.insertMany(propertiesToInsert);
    console.log(`✅ Seeded ${propertiesToInsert.length} Bangalore properties`);
  } else {
    console.log(`ℹ️ Properties already exist (${propCount} records). Skipping.`);
  }

  // 3. Seed Construction Projects
  const projectCount = await ConstructionProject.countDocuments();
  if (projectCount === 0) {
    const projectsToInsert = INITIAL_PROJECTS.map((p) => {
      const { _id, ...rest } = p;
      return rest;
    });
    await ConstructionProject.insertMany(projectsToInsert);
    console.log(`✅ Seeded ${projectsToInsert.length} construction projects`);
  }

  // 4. Seed Testimonials
  const testCount = await Testimonial.countDocuments();
  if (testCount === 0) {
    const testimonialsToInsert = INITIAL_TESTIMONIALS.map((t) => {
      const { _id, ...rest } = t;
      return rest;
    });
    await Testimonial.insertMany(testimonialsToInsert);
    console.log(`✅ Seeded ${testimonialsToInsert.length} testimonials`);
  }

  // 5. Seed Site Settings
  const settingsCount = await SiteSettings.countDocuments();
  if (settingsCount === 0) {
    await SiteSettings.create({
      companyName: 'Banashankari Enterprises',
      founderName: 'Ramesh S H',
      founderTitle: 'Founder & Managing Director',
      founderPhoto: '/founder.jpg',
      primaryPhone: '+91 997 253 6991',
      whatsappNumber: '919972536991',
      email: 'contact@banashankarienterprises.com',
      address: 'Banashankari, Bengaluru, Karnataka 560085',
      city: 'Bangalore',
      state: 'Karnataka',
      businessHours: 'Monday – Saturday: 9:30 AM – 7:30 PM, Sunday: 10:00 AM – 2:00 PM',
      heroHeadline: 'Your Land. Your Dream Home. Our Commitment.',
      heroSubheadline:
        'Discover verified property, build your dream home, and access construction finance with Banashankari Enterprises — led by Ramesh S H.',
      aboutText:
        'Banashankari Enterprises is Bangalore’s premier real estate, construction, and loan assistance partner, led by Ramesh S H.',
      whatsappTemplate:
        'Hello Banashankari Enterprises, I would like to enquire about your real estate and construction services in Bangalore.',
    });
    console.log('✅ Seeded default website settings');
  }

  console.log('\n✨ Database seeding completed successfully!');
  await mongoose.disconnect();
  process.exit(0);
};

seedDatabase().catch((err) => {
  console.error('Seed script error:', err);
  process.exit(1);
});
