import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettingsDocument extends Document {
  companyName: string;
  founderName: string;
  founderTitle?: string;
  founderPhoto?: string;
  primaryPhone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  businessHours: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutText: string;
  whatsappTemplate: string;
  updatedBy?: mongoose.Types.ObjectId;
}

const SiteSettingsSchema = new Schema<ISiteSettingsDocument>(
  {
    companyName: { type: String, default: 'Banashankari Enterprises' },
    founderName: { type: String, default: 'Ramesh S H' },
    founderTitle: { type: String, default: 'Founder & Managing Director' },
    founderPhoto: { type: String, default: '' },
    primaryPhone: { type: String, default: '+91 824 899 2779' },
    whatsappNumber: { type: String, default: '918248992779' },
    email: { type: String, default: 'contact@banashankarienterprises.com' },
    address: { type: String, default: 'Banashankari, Bengaluru' },
    city: { type: String, default: 'Bangalore' },
    state: { type: String, default: 'Karnataka' },
    businessHours: { type: String, default: 'Mon - Sat: 9:30 AM – 7:30 PM, Sun: 10:00 AM – 2:00 PM' },
    heroHeadline: { type: String, default: 'Your Land. Your Dream Home. Our Commitment.' },
    heroSubheadline: {
      type: String,
      default: 'Discover verified property, build your dream home, and access construction finance with Banashankari Enterprises — led by Ramesh S H.',
    },
    aboutText: {
      type: String,
      default: 'Banashankari Enterprises is Bangalore’s premier property and construction partner, founded by Ramesh S H.',
    },
    whatsappTemplate: {
      type: String,
      default: 'Hello Banashankari Enterprises, I would like to enquire about your property and real estate services in Bangalore.',
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings = mongoose.model<ISiteSettingsDocument>('SiteSettings', SiteSettingsSchema);
