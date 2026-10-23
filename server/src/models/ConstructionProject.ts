import mongoose, { Schema, Document } from 'mongoose';

export interface IConstructionProjectDocument extends Document {
  title: string;
  location: string;
  clientType: string;
  status: 'planning' | 'in_progress' | 'completed';
  builtUpArea: string;
  durationMonths?: number;
  description: string;
  coverImage: string;
  gallery: string[];
  features: string[];
  completionYear?: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConstructionProjectSchema = new Schema<IConstructionProjectDocument>(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    clientType: { type: String, default: 'Residential Villa' },
    status: {
      type: String,
      enum: ['planning', 'in_progress', 'completed'],
      default: 'completed',
    },
    builtUpArea: { type: String, required: true },
    durationMonths: Number,
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    features: [{ type: String }],
    completionYear: Number,
    isFeatured: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ConstructionProject = mongoose.model<IConstructionProjectDocument>('ConstructionProject', ConstructionProjectSchema);
