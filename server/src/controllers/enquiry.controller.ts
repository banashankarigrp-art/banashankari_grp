import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Enquiry } from '../models/Enquiry.js';
import { Property } from '../models/Property.js';
import { Notification } from '../models/Notification.js';
import { inMemoryStore } from '../services/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const generateEnquiryRefId = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BSE-ENQ-${random}`;
};

export const createEnquiry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { category, customerName, email, phone, propertyId, details, consent } = req.body;
    const referenceId = generateEnquiryRefId();

    const enquiryData = {
      referenceId,
      userId: req.user?.userId || undefined,
      category,
      customerName,
      email: email.toLowerCase().trim(),
      phone,
      propertyId: propertyId || undefined,
      details: details || {},
      consent: !!consent,
      status: 'submitted' as const,
    };

    if (mongoose.connection.readyState === 1) {
      const enquiry = await Enquiry.create(enquiryData);

      if (req.user?.userId) {
        await Notification.create({
          userId: req.user.userId,
          title: `Enquiry Received (${category.toUpperCase()})`,
          message: `Your enquiry (Ref: ${referenceId}) has been registered with Banashankari Enterprises. Our representative will contact you shortly.`,
          type: 'enquiry_update',
          link: '/dashboard/enquiries',
        });
      }

      res.status(201).json({
        success: true,
        message: 'Your enquiry has been received. Our team will contact you shortly.',
        data: {
          referenceId: enquiry.referenceId,
          status: enquiry.status,
          createdAt: enquiry.createdAt,
        },
      });
    } else {
      const newEnq = {
        ...enquiryData,
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      inMemoryStore.enquiries.push(newEnq);

      if (req.user?.userId) {
        inMemoryStore.notifications.push({
          _id: new mongoose.Types.ObjectId().toString(),
          userId: req.user.userId,
          title: `Enquiry Received (${category.toUpperCase()})`,
          message: `Your enquiry (Ref: ${referenceId}) has been registered with Banashankari Enterprises. Our representative will contact you shortly.`,
          type: 'enquiry_update',
          link: '/dashboard/enquiries',
          isRead: false,
          createdAt: new Date(),
        });
      }

      res.status(201).json({
        success: true,
        message: 'Your enquiry has been received. Our team will contact you shortly.',
        data: {
          referenceId: newEnq.referenceId,
          status: newEnq.status,
          createdAt: newEnq.createdAt,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error submitting enquiry' });
  }
};

export const getMyEnquiries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      // Find properties owned by this user
      const userProperties = await Property.find({ ownerId: req.user.userId }).select('_id');
      const propertyIds = userProperties.map((p) => p._id);

      const enquiries = await Enquiry.find({
        $or: [
          { userId: req.user.userId },
          { email: req.user.email },
          { propertyId: { $in: propertyIds } },
        ],
      })
        .select('-internalNotes')
        .populate('propertyId', 'title slug location pricing images referenceId')
        .sort({ createdAt: -1 });

      res.json({ success: true, data: enquiries });
    } else {
      const userPropIds = inMemoryStore.properties
        .filter((p: any) => p.ownerId === req.user?.userId)
        .map((p: any) => p._id);

      const list = inMemoryStore.enquiries
        .filter(
          (e: any) =>
            e.userId === req.user?.userId ||
            e.email === req.user?.email ||
            (e.propertyId && userPropIds.includes(e.propertyId))
        )
        .map((e) => {
          const { internalNotes: _, ...safeEnq } = e;
          return safeEnq;
        });

      res.json({ success: true, data: list });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching enquiries' });
  }
};

export const trackEnquiryByRef = async (req: Request, res: Response): Promise<void> => {
  try {
    const { referenceId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const enquiry = await Enquiry.findOne({ referenceId })
        .select('referenceId category status customerResponse createdAt updatedAt')
        .populate('propertyId', 'title location');

      if (!enquiry) {
        res.status(404).json({ success: false, message: 'Enquiry reference not found' });
        return;
      }

      res.json({ success: true, data: enquiry });
    } else {
      const enquiry = inMemoryStore.enquiries.find((e) => e.referenceId === referenceId);
      if (!enquiry) {
        res.status(404).json({ success: false, message: 'Enquiry reference not found' });
        return;
      }

      const safe = {
        referenceId: enquiry.referenceId,
        category: enquiry.category,
        status: enquiry.status,
        customerResponse: enquiry.customerResponse,
        createdAt: enquiry.createdAt,
        updatedAt: enquiry.updatedAt,
      };

      res.json({ success: true, data: safe });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error tracking enquiry' });
  }
};
