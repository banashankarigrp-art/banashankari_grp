import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonialDocument extends Document {
  clientName: string;
  locality: string;
  projectType: string;
  quote: string;
  rating: number;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonialDocument>(
  {
    clientName: { type: String, required: true },
    locality: { type: String, required: true },
    projectType: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isApproved: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Testimonial = mongoose.model<ITestimonialDocument>('Testimonial', TestimonialSchema);
