import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiryDocument extends Document {
  referenceId: string;
  userId?: mongoose.Types.ObjectId;
  category: 'general' | 'property' | 'construction' | 'loan' | 'khb';
  customerName: string;
  email: string;
  phone: string;
  propertyId?: mongoose.Types.ObjectId;
  details: {
    message?: string;
    preferredContactTime?: string;
    // Construction specifics
    plotDimensions?: string;
    proposedBuiltUpArea?: number;
    floors?: number;
    constructionBudget?: string;
    expectedStartDate?: string;
    projectLocation?: string;
    // Loan specifics
    loanPurpose?: string;
    approximateLoanAmount?: number;
    employmentType?: string;
    monthlyIncomeRange?: string;
    // KHB specifics
    khbAssistanceType?: string;
    khbLocality?: string;
  };
  consent: boolean;
  status: 'submitted' | 'under_review' | 'contacted' | 'in_progress' | 'resolved' | 'closed';
  assignedAdminId?: mongoose.Types.ObjectId;
  internalNotes?: string;
  followUpAt?: Date;
  customerResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiryDocument>(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    category: {
      type: String,
      enum: ['general', 'property', 'construction', 'loan', 'khb'],
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    details: {
      message: String,
      preferredContactTime: String,
      plotDimensions: String,
      proposedBuiltUpArea: Number,
      floors: Number,
      constructionBudget: String,
      expectedStartDate: String,
      projectLocation: String,
      loanPurpose: String,
      approximateLoanAmount: Number,
      employmentType: String,
      monthlyIncomeRange: String,
      khbAssistanceType: String,
      khbLocality: String,
    },
    consent: {
      type: Boolean,
      required: true,
      default: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'contacted', 'in_progress', 'resolved', 'closed'],
      default: 'submitted',
      index: true,
    },
    assignedAdminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    internalNotes: {
      type: String,
      select: true, // Only returned in admin routes, stripped in customer responses
    },
    followUpAt: Date,
    customerResponse: String,
  },
  {
    timestamps: true,
  }
);

EnquirySchema.index({ category: 1, status: 1, createdAt: -1 });

export const Enquiry = mongoose.model<IEnquiryDocument>('Enquiry', EnquirySchema);
