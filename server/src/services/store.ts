import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, IUserDocument } from '../models/User.js';
import { Property, IPropertyDocument } from '../models/Property.js';
import { Enquiry, IEnquiryDocument } from '../models/Enquiry.js';
import { ConstructionProject } from '../models/ConstructionProject.js';
import { Testimonial } from '../models/Testimonial.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Notification } from '../models/Notification.js';
import { SavedProperty } from '../models/SavedProperty.js';
import { AuditLog } from '../models/AuditLog.js';
import { ENV } from '../config/env.js';

// Initial sample data mirroring the screenshot provided by user
export const INITIAL_PROPERTIES = [
  {
    _id: '67b848011111111111111101',
    referenceId: 'BSE-PROP-1001',
    title: 'BDA Approved Residential Plot in Kenchanahalli',
    slug: 'bda-approved-residential-plot-kenchanahalli',
    propertyType: 'plot',
    listingPurpose: 'sale',
    description: 'Prime East-facing BDA approved residential plot ready for immediate house construction. Clear title deed with A-Katha, direct road frontage, 24/7 Cauvery water line connection, underground drainage, and electricity ready.',
    location: {
      locality: 'Kenchanahalli, Banashankari 6th Stage',
      address: '3rd Cross, 8th Main, Kenchanahalli',
      landmark: 'Near National Public School',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560098',
      isAddressPublic: true,
      coordinates: { lat: 12.8943, lng: 77.5218 },
    },
    pricing: {
      price: 6800000, // ₹68 Lakhs
      isNegotiable: true,
      pricingTerms: '₹5,666 / Sq.Ft (All Inclusive)',
    },
    landArea: 1200,
    builtUpArea: 0,
    areaUnit: 'sqft',
    amenities: ['Cauvery Water', 'Underground Drainage', 'Asphalted 40ft Road', 'Street Lights', 'Compound Wall', 'Ready for Registration'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        caption: 'Plot entrance and asphalted road',
        isCover: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        caption: 'Layout landscaping and drainage lines',
        isCover: false,
      },
    ],
    ownershipDeclaration: {
      isOwner: true,
      hasLegalAuthority: true,
      agreedToTerms: true,
      submissionDate: new Date('2025-01-10'),
    },
    approvalStatus: 'approved',
    publicationStatus: 'published',
    featured: true,
    availabilityStatus: 'available',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    _id: '67b848011111111111111102',
    referenceId: 'BSE-PROP-1002',
    title: 'Contemporary 3 BHK Duplex Villa in Banashankari 3rd Stage',
    slug: 'contemporary-3-bhk-duplex-villa-banashankari-3rd-stage',
    propertyType: 'villa',
    listingPurpose: 'sale',
    description: 'High-end architect-designed 3 BHK independent luxury villa. Features Italian marble flooring, teakwood doors, expansive modular kitchen, private rooftop terrace garden, and premium Jaguar fittings.',
    location: {
      locality: 'Banashankari 3rd Stage',
      address: 'Near Kamakya Theatre & Ring Road',
      landmark: 'Near Deve Gowda Petrol Bunk',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560085',
      isAddressPublic: true,
      coordinates: { lat: 12.9249, lng: 77.5452 },
    },
    pricing: {
      price: 14500000, // ₹1.45 Crore
      isNegotiable: true,
      pricingTerms: '₹7,250 / Sq.Ft Built-up',
    },
    landArea: 1500,
    builtUpArea: 2400,
    areaUnit: 'sqft',
    bedrooms: 3,
    bathrooms: 3,
    furnishing: 'semi-furnished',
    amenities: ['Covered Car Parking', 'Solar Water Heater', 'Borewell & Cauvery Water', 'Rooftop Terrace', 'Vastu Compliant', 'Security Cameras'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Villa Front Elevation',
        isCover: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        caption: 'Living Room and Dining Area',
        isCover: false,
      },
    ],
    ownershipDeclaration: {
      isOwner: true,
      hasLegalAuthority: true,
      agreedToTerms: true,
      submissionDate: new Date('2025-01-12'),
    },
    approvalStatus: 'approved',
    publicationStatus: 'published',
    featured: true,
    availabilityStatus: 'available',
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    _id: '67b848011111111111111103',
    referenceId: 'BSE-PROP-1003',
    title: 'Gated Community Villa Plot in Electronic City Phase 1',
    slug: 'gated-community-villa-plot-electronic-city-phase-1',
    propertyType: 'plot',
    listingPurpose: 'sale',
    description: 'Premium 1500 sqft BMRDA approved villa site in a luxury gated community. 5 minutes from Infosys campus and upcoming metro station. Clubhouse, swimming pool, underground electric cabling, and 24/7 manned security.',
    location: {
      locality: 'Electronic City Phase 1',
      address: 'Near Bettadasanapura Road',
      landmark: 'Near Wipro Gate 5',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560100',
      isAddressPublic: true,
      coordinates: { lat: 12.8452, lng: 77.6602 },
    },
    pricing: {
      price: 5200000, // ₹52 Lakhs
      isNegotiable: true,
      pricingTerms: '₹3,466 / Sq.Ft',
    },
    landArea: 1500,
    builtUpArea: 0,
    areaUnit: 'sqft',
    amenities: ['Gated Security', 'Clubhouse Access', 'Underground Cabling', 'Landscaped Parks', 'Children Play Area', 'Bank Loan Approved'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Gated Avenue Road View',
        isCover: true,
      },
    ],
    ownershipDeclaration: {
      isOwner: true,
      hasLegalAuthority: true,
      agreedToTerms: true,
      submissionDate: new Date('2025-01-15'),
    },
    approvalStatus: 'approved',
    publicationStatus: 'published',
    featured: true,
    availabilityStatus: 'available',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    _id: '67b848011111111111111104',
    referenceId: 'BSE-PROP-1004',
    title: 'Spacious 2 BHK Apartment for Rent in Uttarahalli',
    slug: 'spacious-2-bhk-apartment-rent-uttarahalli',
    propertyType: 'apartment',
    listingPurpose: 'rent',
    description: 'Well-ventilated East-facing 2 BHK apartment on the 3rd floor. Semi-furnished with wardrobes in both bedrooms, modular kitchen cabinets, geysers, and balcony facing green park.',
    location: {
      locality: 'Uttarahalli Main Road',
      address: 'Near Subramanyapura Police Station',
      landmark: 'Near Brigade Omega',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560061',
      isAddressPublic: true,
      coordinates: { lat: 12.9054, lng: 77.5381 },
    },
    pricing: {
      price: 24000, // Monthly Rent
      isNegotiable: false,
      monthlyRent: 24000,
      securityDeposit: 150000,
      maintenanceCharges: 2500,
      pricingTerms: '₹24,000 / Month + Maint',
    },
    landArea: 0,
    builtUpArea: 1150,
    areaUnit: 'sqft',
    bedrooms: 2,
    bathrooms: 2,
    furnishing: 'semi-furnished',
    amenities: ['Lift', 'Power Backup', 'Covered Car Parking', '24/7 Security', 'Intercom', 'Rainwater Harvesting'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        caption: 'Living room and balcony',
        isCover: true,
      },
    ],
    ownershipDeclaration: {
      isOwner: true,
      hasLegalAuthority: true,
      agreedToTerms: true,
      submissionDate: new Date('2025-01-18'),
    },
    approvalStatus: 'approved',
    publicationStatus: 'published',
    featured: true,
    availabilityStatus: 'available',
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-01-18'),
  },
  {
    _id: '67b848011111111111111105',
    referenceId: 'BSE-PROP-1005',
    title: 'Commercial Office / Retail Space on Kanakapura Main Road',
    slug: 'commercial-office-retail-space-kanakapura-road',
    propertyType: 'commercial',
    listingPurpose: 'lease',
    description: 'First floor commercial property with high glass frontage on Kanakapura Main Road. Ideal for clinic, banking branch, IT consultancy, or corporate branch office. Direct metro connectivity within 300m.',
    location: {
      locality: 'Kanakapura Road, Konanakunte Cross',
      address: 'Main Road Frontage',
      landmark: 'Opposite Forum South Bangalore Mall',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560062',
      isAddressPublic: true,
      coordinates: { lat: 12.8856, lng: 77.5541 },
    },
    pricing: {
      price: 75000, // Monthly Lease
      isNegotiable: true,
      monthlyRent: 75000,
      securityDeposit: 600000,
      pricingTerms: '₹75,000 / Month Lease',
    },
    landArea: 0,
    builtUpArea: 1800,
    areaUnit: 'sqft',
    amenities: ['High Visibility Glass Facade', '3 Phase Power 25KW', 'Dedicated Customer Parking', 'High Speed Elevator', 'Fire Fighting System'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Commercial open floor plate',
        isCover: true,
      },
    ],
    ownershipDeclaration: {
      isOwner: true,
      hasLegalAuthority: true,
      agreedToTerms: true,
      submissionDate: new Date('2025-01-20'),
    },
    approvalStatus: 'approved',
    publicationStatus: 'published',
    featured: false,
    availabilityStatus: 'available',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
  },
];

export const INITIAL_PROJECTS = [
  {
    _id: '67b848022222222222222201',
    title: 'The Haven — Contemporary Villa Project',
    location: 'Banashankari 6th Stage, Bangalore',
    clientType: 'Private Residential',
    status: 'completed',
    builtUpArea: '3,800 Sq.Ft (G+2 Floors)',
    durationMonths: 11,
    description: 'Turnkey architectural design, foundation, structural RCC framing, premium brick masonry, electrical, plumbing, and luxury interior woodwork executed under direct supervision of Ramesh S H.',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    features: ['Grade 53 Cement & Fe550 TMT Steel', 'Rainwater Harvesting Pit', 'Custom Teakwood Framing', 'Double Glazed Soundproof Windows'],
    completionYear: 2024,
    isFeatured: true,
  },
  {
    _id: '67b848022222222222222202',
    title: 'Skyline Residence — Structural & Interior Execution',
    location: 'Rajarajeshwari Nagar, Bangalore',
    clientType: 'Independent Residence',
    status: 'completed',
    builtUpArea: '2,650 Sq.Ft (G+1 Floor)',
    durationMonths: 8,
    description: 'Complete home construction from raw ground soil excavation to final paint handover. Handled all municipal approvals, Cauvery water line connection, and BESCOM power sanction.',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    features: ['Soil Bearing Capacity Test Certified', 'High Quality River Sand Plastering', 'Designer False Ceiling with Profile Lighting'],
    completionYear: 2024,
    isFeatured: true,
  },
  {
    _id: '67b848022222222222222203',
    title: 'Green Meadows — Structural RCC Work',
    location: 'Kengeri Satellite Town, Bangalore',
    clientType: 'Multi-Unit Residential',
    status: 'in_progress',
    builtUpArea: '4,200 Sq.Ft (Stilt + 3 Floors)',
    durationMonths: 14,
    description: 'Ongoing commercial & residential composite building. Column casting and post-tension slab reinforcement currently in progress with certified quality inspections at each pour.',
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    features: ['RMC M25 Grade Concrete', 'Ultrasound Weld Testing', 'Anti-Termite Soil Treatment'],
    completionYear: 2025,
    isFeatured: true,
  },
];

export const INITIAL_TESTIMONIALS = [
  {
    _id: '67b848033333333333333301',
    clientName: 'Anand & Sangeetha K.',
    locality: 'Kenchanahalli, Bangalore',
    projectType: 'Plot Purchase & Construction Guidance',
    quote: 'Banashankari Enterprises guided us through purchasing our plot in Kenchanahalli with complete title verification. Ramesh S H gave transparent advice on building regulations and bank approvals. Truly refreshing honesty!',
    rating: 5,
    isApproved: true,
    isFeatured: true,
  },
  {
    _id: '67b848033333333333333302',
    clientName: 'Dr. Manjunath Murthy',
    locality: 'Banashankari 3rd Stage',
    projectType: 'Turnkey Residential Construction',
    quote: 'We entrusted Ramesh S H with the complete turnkey construction of our 3 BHK duplex home. The structural quality, daily photographic updates, and adherence to agreed budgets exceeded all our family expectations.',
    rating: 5,
    isApproved: true,
    isFeatured: true,
  },
  {
    _id: '67b848033333333333333303',
    clientName: 'Bhavana Hegde',
    locality: 'Electronic City, Bangalore',
    projectType: 'KHB Assistance & Loan Coordination',
    quote: 'Navigating KHB documentation and bank loan sanctions can be overwhelming in Bangalore. Banashankari Enterprises simplified every single step, cleared our paperwork, and got our loan sanctioned without hassles.',
    rating: 5,
    isApproved: true,
    isFeatured: true,
  },
];

// Reactive in-memory fallback store
export class InMemoryStore {
  users: any[] = [];
  properties: any[] = [...INITIAL_PROPERTIES];
  enquiries: any[] = [];
  projects: any[] = [...INITIAL_PROJECTS];
  testimonials: any[] = [...INITIAL_TESTIMONIALS];
  notifications: any[] = [];
  savedProperties: any[] = [];
  auditLogs: any[] = [];
  settings: any = {
    companyName: 'Banashankari Enterprises',
    founderName: 'Ramesh S H',
    founderTitle: 'Founder & Managing Director',
    founderPhoto: '/founder.jpg',
    primaryPhone: '+91 824 899 2779',
    whatsappNumber: '918248992779',
    email: 'contact@banashankarienterprises.com',
    address: 'Banashankari, Bengaluru, Karnataka 560085',
    city: 'Bangalore',
    state: 'Karnataka',
    businessHours: 'Monday – Saturday: 9:30 AM – 7:30 PM, Sunday: 10:00 AM – 2:00 PM',
    heroHeadline: 'Your Land. Your Dream Home. Our Commitment.',
    heroSubheadline: 'Discover verified property, build your dream home, and access construction finance with Banashankari Enterprises — led by Ramesh S H.',
    aboutText: 'Banashankari Enterprises is a premier real estate, construction, and loan assistance firm in Bangalore led by Ramesh S H.',
    whatsappTemplate: 'Hello Banashankari Enterprises, I would like to enquire about your real estate and construction services.',
  };

  constructor() {
    this.seedDefaultUsers();
  }

  async seedDefaultUsers() {
    const adminHash = await bcrypt.hash(ENV.INITIAL_ADMIN_PASSWORD, 10);
    this.users.push({
      _id: '67b848000000000000000001',
      name: ENV.INITIAL_ADMIN_NAME,
      email: ENV.INITIAL_ADMIN_EMAIL.toLowerCase(),
      phone: ENV.INITIAL_ADMIN_PHONE,
      passwordHash: adminHash,
      role: 'admin',
      accountStatus: 'active',
      emailVerified: true,
      profile: { city: 'Bangalore', state: 'Karnataka' },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Default customer for quick local testing if desired
    const demoCustomerHash = await bcrypt.hash('Customer@123', 10);
    this.users.push({
      _id: '67b848000000000000000002',
      name: 'Rithvik Kumar',
      email: 'customer@banashankari.com',
      phone: '+91 9876543210',
      passwordHash: demoCustomerHash,
      role: 'customer',
      accountStatus: 'active',
      emailVerified: true,
      profile: { city: 'Bangalore', state: 'Karnataka' },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Assign ownerId to initial properties
    this.properties.forEach((p) => {
      p.ownerId = '67b848000000000000000001';
    });

    // Add initial sample enquiries
    this.enquiries.push({
      _id: '67b848044444444444444401',
      referenceId: 'BSE-ENQ-8001',
      userId: '67b848000000000000000002',
      category: 'property',
      customerName: 'Praveen Sharma',
      email: 'praveen.s@example.com',
      phone: '+91 9845012345',
      propertyId: '67b848011111111111111101',
      details: {
        message: 'Interested in site inspection for the Kenchanahalli plot this Saturday morning.',
        preferredContactTime: '10:00 AM - 1:00 PM',
      },
      consent: true,
      status: 'contacted',
      assignedAdminId: '67b848000000000000000001',
      internalNotes: 'Client spoken to on phone. Arranged site visit with Ramesh S H on Saturday 11 AM.',
      customerResponse: 'Our team will meet you at the site location on Saturday at 11:00 AM.',
      createdAt: new Date('2025-01-22'),
      updatedAt: new Date('2025-01-22'),
    });

    this.enquiries.push({
      _id: '67b848044444444444444402',
      referenceId: 'BSE-ENQ-8002',
      userId: '67b848000000000000000002',
      category: 'construction',
      customerName: 'Suresh Reddy',
      email: 'suresh.reddy@example.com',
      phone: '+91 9448098765',
      details: {
        plotDimensions: '30 x 40 (1200 Sqft)',
        proposedBuiltUpArea: 2200,
        floors: 2,
        constructionBudget: '₹45 Lakhs - ₹55 Lakhs',
        projectLocation: 'Kanakapura Road, Bangalore',
        message: 'Looking for turnkey residential construction quotation for G+1 independent house.',
      },
      consent: true,
      status: 'under_review',
      assignedAdminId: '67b848000000000000000001',
      internalNotes: 'Preliminary architectural floor plan needs review before cost sheet preparation.',
      createdAt: new Date('2025-01-23'),
      updatedAt: new Date('2025-01-23'),
    });

    this.enquiries.push({
      _id: '67b848044444444444444403',
      referenceId: 'BSE-ENQ-8003',
      userId: '67b848000000000000000002',
      category: 'loan',
      customerName: 'Kavitha R',
      email: 'kavitha.r@example.com',
      phone: '+91 9741234567',
      details: {
        loanPurpose: 'home_construction',
        approximateLoanAmount: 4000000,
        employmentType: 'salaried',
        monthlyIncomeRange: '₹1,00,000 – ₹1,50,000',
        message: 'Assistance needed for SBI home construction loan sanction.',
      },
      consent: true,
      status: 'submitted',
      createdAt: new Date('2025-01-24'),
      updatedAt: new Date('2025-01-24'),
    });

    this.enquiries.push({
      _id: '67b848044444444444444404',
      referenceId: 'BSE-ENQ-8004',
      userId: '67b848000000000000000002',
      category: 'khb',
      customerName: 'Venkatesh Rao',
      email: 'venkatesh.rao@example.com',
      phone: '+91 9880123456',
      details: {
        khbAssistanceType: 'transfer_assistance',
        khbLocality: 'Kengeri KHB Layout',
        message: 'Assistance required for documentation check and transfer clearance of KHB allotted property.',
      },
      consent: true,
      status: 'in_progress',
      assignedAdminId: '67b848000000000000000001',
      internalNotes: 'Allotment letter and possession certificate verified with client. Preparing checklist.',
      createdAt: new Date('2025-01-24'),
      updatedAt: new Date('2025-01-24'),
    });
  }
}

export const inMemoryStore = new InMemoryStore();
