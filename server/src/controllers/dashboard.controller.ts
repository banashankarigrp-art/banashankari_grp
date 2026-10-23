import { Response } from 'express';
import mongoose from 'mongoose';
import { Property } from '../models/Property.js';
import { Enquiry } from '../models/Enquiry.js';
import { SavedProperty } from '../models/SavedProperty.js';
import { Notification } from '../models/Notification.js';
import { inMemoryStore } from '../services/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getCustomerSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const userId = req.user.userId;

    if (mongoose.connection.readyState === 1) {
      const [
        totalProperties,
        publishedProperties,
        pendingProperties,
        activeEnquiries,
        savedPropertiesCount,
        recentNotifications,
      ] = await Promise.all([
        Property.countDocuments({ ownerId: userId }),
        Property.countDocuments({ ownerId: userId, publicationStatus: 'published' }),
        Property.countDocuments({ ownerId: userId, approvalStatus: 'pending_review' }),
        Enquiry.countDocuments({
          $or: [{ userId }, { email: req.user.email }],
          status: { $in: ['submitted', 'under_review', 'contacted', 'in_progress'] },
        }),
        SavedProperty.countDocuments({ userId }),
        Notification.find({ userId }).sort({ createdAt: -1 }).limit(5),
      ]);

      res.json({
        success: true,
        data: {
          totalProperties,
          publishedProperties,
          pendingProperties,
          activeEnquiries,
          savedPropertiesCount,
          recentNotifications,
        },
      });
    } else {
      const userProps = inMemoryStore.properties.filter((p) => p.ownerId === userId);
      const totalProperties = userProps.length;
      const publishedProperties = userProps.filter((p) => p.publicationStatus === 'published').length;
      const pendingProperties = userProps.filter((p) => p.approvalStatus === 'pending_review').length;

      const activeEnquiries = inMemoryStore.enquiries.filter(
        (e) =>
          (e.userId === userId || e.email === req.user?.email) &&
          ['submitted', 'under_review', 'contacted', 'in_progress'].includes(e.status)
      ).length;

      const savedPropertiesCount = inMemoryStore.savedProperties.filter((s) => s.userId === userId).length;
      const recentNotifications = inMemoryStore.notifications
        .filter((n) => n.userId === userId)
        .slice(-5)
        .reverse();

      res.json({
        success: true,
        data: {
          totalProperties,
          publishedProperties,
          pendingProperties,
          activeEnquiries,
          savedPropertiesCount,
          recentNotifications,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching dashboard summary' });
  }
};

export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
      res.json({ success: true, data: notifications });
    } else {
      const notifications = inMemoryStore.notifications
        .filter((n) => n.userId === req.user?.userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json({ success: true, data: notifications });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching notifications' });
  }
};

export const markNotificationRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      await Notification.updateOne({ _id: id, userId: req.user.userId }, { isRead: true });
      res.json({ success: true, message: 'Notification marked as read' });
    } else {
      const notif = inMemoryStore.notifications.find((n) => n._id === id && n.userId === req.user?.userId);
      if (notif) notif.isRead = true;
      res.json({ success: true, message: 'Notification marked as read' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating notification' });
  }
};
