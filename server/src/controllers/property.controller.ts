import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Property } from '../models/Property.js';
import { SavedProperty } from '../models/SavedProperty.js';
import { Notification } from '../models/Notification.js';
import { inMemoryStore } from '../services/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// Helper to generate reference IDs
const generatePropRefId = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BSE-PROP-${random}`;
};

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;
};

export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      locality,
      propertyType,
      listingPurpose,
      minPrice,
      maxPrice,
      bedrooms,
      sortBy = 'newest',
      page = '1',
      limit = '9',
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    if (mongoose.connection.readyState === 1) {
      const filter: any = {
        approvalStatus: 'approved',
        publicationStatus: 'published',
      };

      if (propertyType && propertyType !== 'all') {
        filter.propertyType = propertyType;
      }

      if (listingPurpose && listingPurpose !== 'all') {
        filter.listingPurpose = listingPurpose;
      }

      if (locality) {
        filter['location.locality'] = { $regex: locality as string, $options: 'i' };
      }

      if (minPrice || maxPrice) {
        filter['pricing.price'] = {};
        if (minPrice) filter['pricing.price'].$gte = Number(minPrice);
        if (maxPrice) filter['pricing.price'].$lte = Number(maxPrice);
      }

      if (bedrooms && bedrooms !== 'all') {
        filter.bedrooms = Number(bedrooms);
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search as string, $options: 'i' } },
          { description: { $regex: search as string, $options: 'i' } },
          { 'location.locality': { $regex: search as string, $options: 'i' } },
        ];
      }

      let sortQuery: any = { createdAt: -1 };
      if (sortBy === 'price_asc') sortQuery = { 'pricing.price': 1 };
      if (sortBy === 'price_desc') sortQuery = { 'pricing.price': -1 };
      if (sortBy === 'featured') sortQuery = { featured: -1, createdAt: -1 };

      const [properties, total] = await Promise.all([
        Property.find(filter)
          .sort(sortQuery)
          .skip(skip)
          .limit(limitNum)
          .select('-reviewNotes -ownershipDeclaration.agreedToTerms'),
        Property.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: properties,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } else {
      // In-memory fallback
      let list = inMemoryStore.properties.filter(
        (p) => p.approvalStatus === 'approved' && p.publicationStatus === 'published'
      );

      if (propertyType && propertyType !== 'all') {
        list = list.filter((p) => p.propertyType === propertyType);
      }

      if (listingPurpose && listingPurpose !== 'all') {
        list = list.filter((p) => p.listingPurpose === listingPurpose);
      }

      if (locality) {
        const locLower = (locality as string).toLowerCase();
        list = list.filter((p) => p.location.locality.toLowerCase().includes(locLower));
      }

      if (minPrice) {
        list = list.filter((p) => p.pricing.price >= Number(minPrice));
      }
      if (maxPrice) {
        list = list.filter((p) => p.pricing.price <= Number(maxPrice));
      }

      if (bedrooms && bedrooms !== 'all') {
        list = list.filter((p) => p.bedrooms === Number(bedrooms));
      }

      if (search) {
        const sLower = (search as string).toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(sLower) ||
            p.description.toLowerCase().includes(sLower) ||
            p.location.locality.toLowerCase().includes(sLower)
        );
      }

      if (sortBy === 'price_asc') {
        list.sort((a, b) => a.pricing.price - b.pricing.price);
      } else if (sortBy === 'price_desc') {
        list.sort((a, b) => b.pricing.price - a.pricing.price);
      } else {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const total = list.length;
      const paginated = list.slice(skip, skip + limitNum);

      res.json({
        success: true,
        data: paginated,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching properties' });
  }
};

export const getPropertyBySlugOrId = async (req: Request, res: Response): Promise<void> => {
  try {
    const identifier = req.params.identifier as string;

    if (mongoose.connection.readyState === 1) {
      const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
      const query = isObjectId ? { _id: identifier } : { slug: identifier };

      const property = await Property.findOne(query)
        .populate('ownerId', 'name')
        .select('-reviewNotes');

      if (!property) {
        res.status(404).json({ success: false, message: 'Property listing not found' });
        return;
      }

      // If address is private, censor exact address line
      if (!property.location.isAddressPublic && property.location.address) {
        property.location.address = `${property.location.locality}, Bangalore (Full address provided on site visit confirmation)`;
      }

      // Fetch similar properties
      const similar = await Property.find({
        _id: { $ne: property._id },
        propertyType: property.propertyType,
        approvalStatus: 'approved',
        publicationStatus: 'published',
      })
        .limit(3)
        .select('title slug pricing location images propertyType listingPurpose bedrooms builtUpArea landArea');

      res.json({ success: true, data: property, similar });
    } else {
      const property = inMemoryStore.properties.find(
        (p) => p.slug === identifier || p._id === identifier || p.referenceId === identifier
      );

      if (!property) {
        res.status(404).json({ success: false, message: 'Property listing not found' });
        return;
      }

      const copy = JSON.parse(JSON.stringify(property));
      if (!copy.location.isAddressPublic && copy.location.address) {
        copy.location.address = `${copy.location.locality}, Bangalore (Full address provided on site visit confirmation)`;
      }

      const similar = inMemoryStore.properties
        .filter(
          (p) =>
            p._id !== property._id &&
            p.propertyType === property.propertyType &&
            p.approvalStatus === 'approved' &&
            p.publicationStatus === 'published'
        )
        .slice(0, 3);

      res.json({ success: true, data: copy, similar });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching property' });
  }
};

import fs from 'fs';
import path from 'path';

// Helper to save base64 uploaded device images to disk in uploads/properties
const saveBase64Images = (images: any[], referenceId: string) => {
  if (!Array.isArray(images) || images.length === 0) return images;

  const uploadsDir = path.join(process.cwd(), 'uploads', 'properties');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  return images.map((img: any, idx: number) => {
    if (typeof img?.url === 'string' && img.url.startsWith('data:image/')) {
      try {
        const matches = img.url.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const rawExt = matches[1].toLowerCase();
          const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt;
          const cleanRef = referenceId.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
          const filename = `${cleanRef}-photo-${idx + 1}-${Date.now()}.${ext}`;
          const filePath = path.join(uploadsDir, filename);
          const buffer = Buffer.from(matches[2], 'base64');
          fs.writeFileSync(filePath, buffer);
          return {
            ...img,
            url: `/uploads/properties/${filename}`,
          };
        }
      } catch (err) {
        console.error('Failed to save uploaded image:', err);
      }
    }
    return img;
  });
};

export const createProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in to submit a property' });
      return;
    }

    const payload = req.body;
    const referenceId = generatePropRefId();
    const slug = slugify(payload.title);

    const isAdmin = req.user.role === 'admin';
    const processedImages = saveBase64Images(payload.images || [], referenceId);

    const propertyData = {
      ...payload,
      images: processedImages,
      referenceId,
      slug,
      ownerId: req.user.userId,
      approvalStatus: isAdmin ? 'approved' : 'pending_review',
      publicationStatus: isAdmin ? 'published' : 'unpublished',
      featured: payload.featured || false,
      availabilityStatus: 'available',
    };

    if (mongoose.connection.readyState === 1) {
      const property = await Property.create(propertyData);

      // Create confirmation notification
      await Notification.create({
        userId: req.user.userId,
        title: isAdmin ? 'Property Listed & Published Live' : 'Listing Submitted for Review',
        message: isAdmin
          ? `Property listing "${property.title}" (Ref: ${referenceId}) has been created and published live directly.`
          : `Your property listing "${property.title}" (Ref: ${referenceId}) has been received and is under administrative review.`,
        type: 'listing_update',
        link: isAdmin ? '/admin/properties' : `/dashboard/properties`,
      });

      res.status(201).json({
        success: true,
        message: isAdmin
          ? 'Property listing created and published live successfully!'
          : 'Property listing submitted successfully! Our administrative team will verify and publish it.',
        data: property,
      });
    } else {
      const newProp = {
        ...propertyData,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      inMemoryStore.properties.push(newProp);

      inMemoryStore.notifications.push({
        _id: new mongoose.Types.ObjectId().toString(),
        userId: req.user.userId,
        title: isAdmin ? 'Property Listed & Published Live' : 'Listing Submitted for Review',
        message: isAdmin
          ? `Property listing "${newProp.title}" (Ref: ${referenceId}) has been created and published live directly.`
          : `Your property listing "${newProp.title}" (Ref: ${referenceId}) has been received and is under administrative review.`,
        type: 'listing_update',
        link: isAdmin ? '/admin/properties' : `/dashboard/properties`,
        isRead: false,
        createdAt: new Date(),
      });

      res.status(201).json({
        success: true,
        message: isAdmin
          ? 'Property listing created and published live successfully!'
          : 'Property listing submitted successfully! Our administrative team will verify and publish it.',
        data: newProp,
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to submit property' });
  }
};

export const getMyProperties = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const properties = await Property.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });
      res.json({ success: true, data: properties });
    } else {
      const properties = inMemoryStore.properties.filter((p) => p.ownerId === req.user?.userId);
      res.json({ success: true, data: properties });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching user properties' });
  }
};

export const updateMyProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const property = await Property.findOne({ _id: id, ownerId: req.user.userId });
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found or unauthorized' });
        return;
      }

      // Material edit returns to review
      Object.assign(property, req.body);
      property.approvalStatus = 'pending_review';
      property.publicationStatus = 'unpublished';
      await property.save();

      res.json({
        success: true,
        message: 'Listing updated and resubmitted for administrative verification',
        data: property,
      });
    } else {
      const property = inMemoryStore.properties.find(
        (p) => p._id === id && p.ownerId === req.user?.userId
      );
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found or unauthorized' });
        return;
      }

      Object.assign(property, req.body, {
        approvalStatus: 'pending_review',
        publicationStatus: 'unpublished',
        updatedAt: new Date(),
      });

      res.json({
        success: true,
        message: 'Listing updated and resubmitted for administrative verification',
        data: property,
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update property' });
  }
};

export const withdrawMyProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const property = await Property.findOne({ _id: id, ownerId: req.user.userId });
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found or unauthorized' });
        return;
      }

      property.availabilityStatus = 'withdrawn';
      property.publicationStatus = 'unpublished';
      await property.save();

      res.json({ success: true, message: 'Listing withdrawn successfully', data: property });
    } else {
      const property = inMemoryStore.properties.find(
        (p) => p._id === id && p.ownerId === req.user?.userId
      );
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found or unauthorized' });
        return;
      }

      property.availabilityStatus = 'withdrawn';
      property.publicationStatus = 'unpublished';

      res.json({ success: true, message: 'Listing withdrawn successfully', data: property });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to withdraw property' });
  }
};

export const toggleSaveProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please log in to save properties' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const existing = await SavedProperty.findOne({ userId: req.user.userId, propertyId: id });
      if (existing) {
        await SavedProperty.deleteOne({ _id: existing._id });
        res.json({ success: true, isSaved: false, message: 'Property removed from saved list' });
      } else {
        await SavedProperty.create({ userId: req.user.userId, propertyId: id });
        res.json({ success: true, isSaved: true, message: 'Property bookmarked to saved list' });
      }
    } else {
      const idx = inMemoryStore.savedProperties.findIndex(
        (s) => s.userId === req.user?.userId && s.propertyId === id
      );
      if (idx !== -1) {
        inMemoryStore.savedProperties.splice(idx, 1);
        res.json({ success: true, isSaved: false, message: 'Property removed from saved list' });
      } else {
        inMemoryStore.savedProperties.push({
          _id: new mongoose.Types.ObjectId().toString(),
          userId: req.user.userId,
          propertyId: id,
          createdAt: new Date(),
        });
        res.json({ success: true, isSaved: true, message: 'Property bookmarked to saved list' });
      }
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error toggling saved property' });
  }
};

export const getSavedProperties = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const saved = await SavedProperty.find({ userId: req.user.userId }).populate('propertyId');
      const properties = saved.map((s) => s.propertyId).filter(Boolean);
      res.json({ success: true, data: properties });
    } else {
      const savedPropIds = inMemoryStore.savedProperties
        .filter((s) => s.userId === req.user?.userId)
        .map((s) => s.propertyId);

      const properties = inMemoryStore.properties.filter((p) => savedPropIds.includes(p._id));
      res.json({ success: true, data: properties });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching saved properties' });
  }
};
