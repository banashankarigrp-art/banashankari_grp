import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Property } from '../models/Property.js';
import { Enquiry } from '../models/Enquiry.js';
import { AuditLog } from '../models/AuditLog.js';
import { Notification } from '../models/Notification.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { inMemoryStore } from '../services/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// Helper to log audit events
const logAdminAction = async (
  actor: { userId: string; name?: string; email: string },
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, any>,
  ip?: string
) => {
  const auditData = {
    actorId: actor.userId,
    actorName: actor.name || 'Admin',
    actorEmail: actor.email,
    action,
    targetType,
    targetId,
    details,
    ipAddress: ip,
  };

  if (mongoose.connection.readyState === 1) {
    try {
      await AuditLog.create(auditData);
    } catch (e) {
      console.error('Failed to write audit log:', e);
    }
  } else {
    inMemoryStore.auditLogs.unshift({
      _id: new mongoose.Types.ObjectId().toString(),
      ...auditData,
      createdAt: new Date(),
    });
  }
};

export const getAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const [
        totalUsers,
        activeUsers,
        totalProperties,
        pendingApprovals,
        publishedListings,
        rejectedListings,
        soldListings,
        totalEnquiries,
        saleEnquiries,
        rentalEnquiries,
        constructionEnquiries,
        loanEnquiries,
        khbEnquiries,
        recentActivity,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ accountStatus: 'active' }),
        Property.countDocuments(),
        Property.countDocuments({ approvalStatus: 'pending_review' }),
        Property.countDocuments({ publicationStatus: 'published' }),
        Property.countDocuments({ approvalStatus: 'rejected' }),
        Property.countDocuments({ availabilityStatus: 'sold' }),
        Enquiry.countDocuments(),
        Enquiry.countDocuments({ category: 'property' }),
        Enquiry.countDocuments({ category: 'general' }),
        Enquiry.countDocuments({ category: 'construction' }),
        Enquiry.countDocuments({ category: 'loan' }),
        Enquiry.countDocuments({ category: 'khb' }),
        AuditLog.find().sort({ createdAt: -1 }).limit(10),
      ]);

      // Aggregate breakdown for Recharts
      const categoryBreakdown = [
        { name: 'Property Enquiries', value: saleEnquiries },
        { name: 'Construction', value: constructionEnquiries },
        { name: 'Bank Loan', value: loanEnquiries },
        { name: 'KHB Assistance', value: khbEnquiries },
        { name: 'General Enquiries', value: rentalEnquiries },
      ];

      const propertyStatusBreakdown = [
        { status: 'Published', count: publishedListings },
        { status: 'Pending Review', count: pendingApprovals },
        { status: 'Rejected', count: rejectedListings },
        { status: 'Sold / Leased', count: soldListings },
      ];

      res.json({
        success: true,
        data: {
          metrics: {
            totalUsers,
            activeUsers,
            totalProperties,
            pendingApprovals,
            publishedListings,
            rejectedListings,
            soldListings,
            totalEnquiries,
          },
          charts: {
            categoryBreakdown,
            propertyStatusBreakdown,
          },
          recentActivity,
        },
      });
    } else {
      const totalUsers = inMemoryStore.users.length;
      const activeUsers = inMemoryStore.users.filter((u) => u.accountStatus === 'active').length;
      const totalProperties = inMemoryStore.properties.length;
      const pendingApprovals = inMemoryStore.properties.filter((p) => p.approvalStatus === 'pending_review').length;
      const publishedListings = inMemoryStore.properties.filter((p) => p.publicationStatus === 'published').length;
      const rejectedListings = inMemoryStore.properties.filter((p) => p.approvalStatus === 'rejected').length;
      const soldListings = inMemoryStore.properties.filter((p) => p.availabilityStatus === 'sold').length;

      const totalEnquiries = inMemoryStore.enquiries.length;
      const saleEnquiries = inMemoryStore.enquiries.filter((e) => e.category === 'property').length;
      const constructionEnquiries = inMemoryStore.enquiries.filter((e) => e.category === 'construction').length;
      const loanEnquiries = inMemoryStore.enquiries.filter((e) => e.category === 'loan').length;
      const khbEnquiries = inMemoryStore.enquiries.filter((e) => e.category === 'khb').length;
      const generalEnquiries = inMemoryStore.enquiries.filter((e) => e.category === 'general').length;

      const categoryBreakdown = [
        { name: 'Property Enquiries', value: saleEnquiries },
        { name: 'Construction', value: constructionEnquiries },
        { name: 'Bank Loan', value: loanEnquiries },
        { name: 'KHB Assistance', value: khbEnquiries },
        { name: 'General Enquiries', value: generalEnquiries },
      ];

      const propertyStatusBreakdown = [
        { status: 'Published', count: publishedListings },
        { status: 'Pending Review', count: pendingApprovals },
        { status: 'Rejected', count: rejectedListings },
        { status: 'Sold / Leased', count: soldListings },
      ];

      res.json({
        success: true,
        data: {
          metrics: {
            totalUsers,
            activeUsers,
            totalProperties,
            pendingApprovals,
            publishedListings,
            rejectedListings,
            soldListings,
            totalEnquiries,
          },
          charts: {
            categoryBreakdown,
            propertyStatusBreakdown,
          },
          recentActivity: inMemoryStore.auditLogs.slice(0, 10),
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching analytics' });
  }
};

export const getAllPropertiesAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { approvalStatus, publicationStatus, propertyType, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter: any = {};
      if (approvalStatus) filter.approvalStatus = approvalStatus;
      if (publicationStatus) filter.publicationStatus = publicationStatus;
      if (propertyType) filter.propertyType = propertyType;
      if (search) {
        filter.$or = [
          { title: { $regex: search as string, $options: 'i' } },
          { referenceId: { $regex: search as string, $options: 'i' } },
          { 'location.locality': { $regex: search as string, $options: 'i' } },
        ];
      }

      const properties = await Property.find(filter)
        .populate('ownerId', 'name email phone')
        .sort({ createdAt: -1 });

      res.json({ success: true, data: properties });
    } else {
      let list = [...inMemoryStore.properties];
      if (approvalStatus) list = list.filter((p) => p.approvalStatus === approvalStatus);
      if (publicationStatus) list = list.filter((p) => p.publicationStatus === publicationStatus);
      if (propertyType) list = list.filter((p) => p.propertyType === propertyType);
      if (search) {
        const s = (search as string).toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(s) ||
            p.referenceId.toLowerCase().includes(s) ||
            p.location.locality.toLowerCase().includes(s)
        );
      }
      res.json({ success: true, data: list });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching admin properties' });
  }
};

export const approveProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { publishImmediately = true } = req.body;

    if (mongoose.connection.readyState === 1) {
      const property = await Property.findById(id);
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      property.approvalStatus = 'approved';
      if (publishImmediately) {
        property.publicationStatus = 'published';
      }
      property.reviewedBy = new mongoose.Types.ObjectId(req.user?.userId);
      property.reviewedAt = new Date();
      await property.save();

      await Notification.create({
        userId: property.ownerId,
        title: 'Listing Approved!',
        message: `Your property listing "${property.title}" (Ref: ${property.referenceId}) has been approved by the administrator and is now live!`,
        type: 'listing_update',
        link: `/properties/${property.slug}`,
      });

      await logAdminAction(
        req.user!,
        'APPROVE_PROPERTY',
        'Property',
        property._id.toString(),
        { title: property.title, referenceId: property.referenceId },
        req.ip
      );

      res.json({ success: true, message: 'Property approved successfully', data: property });
    } else {
      const property = inMemoryStore.properties.find((p) => p._id === id);
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      property.approvalStatus = 'approved';
      if (publishImmediately) {
        property.publicationStatus = 'published';
      }
      property.reviewedAt = new Date();

      inMemoryStore.notifications.push({
        _id: new mongoose.Types.ObjectId().toString(),
        userId: property.ownerId,
        title: 'Listing Approved!',
        message: `Your property listing "${property.title}" (Ref: ${property.referenceId}) has been approved by the administrator and is now live!`,
        type: 'listing_update',
        link: `/properties/${property.slug}`,
        isRead: false,
        createdAt: new Date(),
      });

      await logAdminAction(
        req.user!,
        'APPROVE_PROPERTY',
        'Property',
        property._id,
        { title: property.title, referenceId: property.referenceId },
        req.ip
      );

      res.json({ success: true, message: 'Property approved successfully', data: property });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error approving property' });
  }
};

export const rejectProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      res.status(400).json({ success: false, message: 'Please provide a reason for rejection' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const property = await Property.findById(id);
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      property.approvalStatus = 'rejected';
      property.publicationStatus = 'unpublished';
      property.reviewNotes = reason;
      property.reviewedBy = new mongoose.Types.ObjectId(req.user?.userId);
      property.reviewedAt = new Date();
      await property.save();

      await Notification.create({
        userId: property.ownerId,
        title: 'Listing Not Approved',
        message: `Your property listing "${property.title}" was not approved. Reason: ${reason}`,
        type: 'listing_update',
        link: `/dashboard/properties`,
      });

      await logAdminAction(
        req.user!,
        'REJECT_PROPERTY',
        'Property',
        property._id.toString(),
        { title: property.title, reason },
        req.ip
      );

      res.json({ success: true, message: 'Property rejected', data: property });
    } else {
      const property = inMemoryStore.properties.find((p) => p._id === id);
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      property.approvalStatus = 'rejected';
      property.publicationStatus = 'unpublished';
      property.reviewNotes = reason;
      property.reviewedAt = new Date();

      inMemoryStore.notifications.push({
        _id: new mongoose.Types.ObjectId().toString(),
        userId: property.ownerId,
        title: 'Listing Not Approved',
        message: `Your property listing "${property.title}" was not approved. Reason: ${reason}`,
        type: 'listing_update',
        link: `/dashboard/properties`,
        isRead: false,
        createdAt: new Date(),
      });

      await logAdminAction(
        req.user!,
        'REJECT_PROPERTY',
        'Property',
        property._id,
        { title: property.title, reason },
        req.ip
      );

      res.json({ success: true, message: 'Property rejected', data: property });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error rejecting property' });
  }
};

export const togglePublishProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const property = await Property.findById(id);
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      property.publicationStatus = property.publicationStatus === 'published' ? 'unpublished' : 'published';
      await property.save();

      await logAdminAction(
        req.user!,
        property.publicationStatus === 'published' ? 'PUBLISH_PROPERTY' : 'UNPUBLISH_PROPERTY',
        'Property',
        property._id.toString(),
        { title: property.title },
        req.ip
      );

      res.json({ success: true, message: `Listing is now ${property.publicationStatus}`, data: property });
    } else {
      const property = inMemoryStore.properties.find((p) => p._id === id);
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      property.publicationStatus = property.publicationStatus === 'published' ? 'unpublished' : 'published';

      await logAdminAction(
        req.user!,
        property.publicationStatus === 'published' ? 'PUBLISH_PROPERTY' : 'UNPUBLISH_PROPERTY',
        'Property',
        property._id,
        { title: property.title },
        req.ip
      );

      res.json({ success: true, message: `Listing is now ${property.publicationStatus}`, data: property });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error toggling publication' });
  }
};

export const toggleFeatureProperty = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const property = await Property.findById(id);
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      property.featured = !property.featured;
      await property.save();

      res.json({ success: true, message: `Property is now ${property.featured ? 'featured' : 'unfeatured'}`, data: property });
    } else {
      const property = inMemoryStore.properties.find((p) => p._id === id);
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      property.featured = !property.featured;
      res.json({ success: true, message: `Property is now ${property.featured ? 'featured' : 'unfeatured'}`, data: property });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error toggling featured status' });
  }
};

export const updatePropertyAvailability = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['available', 'under_offer', 'sold', 'rented', 'leased', 'withdrawn'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid availability status' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const property = await Property.findById(id);
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      property.availabilityStatus = status;
      await property.save();

      await logAdminAction(
        req.user!,
        'UPDATE_PROPERTY_AVAILABILITY',
        'Property',
        property._id.toString(),
        { newStatus: status, title: property.title },
        req.ip
      );

      res.json({ success: true, message: `Property marked as ${status}`, data: property });
    } else {
      const property = inMemoryStore.properties.find((p) => p._id === id);
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      property.availabilityStatus = status;

      await logAdminAction(
        req.user!,
        'UPDATE_PROPERTY_AVAILABILITY',
        'Property',
        property._id,
        { newStatus: status, title: property.title },
        req.ip
      );

      res.json({ success: true, message: `Property marked as ${status}`, data: property });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating availability' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, status } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter: any = {};
      if (status) filter.accountStatus = status;
      if (search) {
        filter.$or = [
          { name: { $regex: search as string, $options: 'i' } },
          { email: { $regex: search as string, $options: 'i' } },
          { phone: { $regex: search as string, $options: 'i' } },
        ];
      }

      const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
      res.json({ success: true, data: users });
    } else {
      let list = inMemoryStore.users.map((u) => {
        const { passwordHash: _, ...safe } = u;
        return safe;
      });

      if (status) list = list.filter((u) => u.accountStatus === status);
      if (search) {
        const s = (search as string).toLowerCase();
        list = list.filter(
          (u) =>
            u.name.toLowerCase().includes(s) ||
            u.email.toLowerCase().includes(s) ||
            u.phone.toLowerCase().includes(s)
        );
      }

      res.json({ success: true, data: list });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching users' });
  }
};

export const updateUserStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      if (user.role === 'admin' && status === 'suspended') {
        res.status(400).json({ success: false, message: 'Primary administrator accounts cannot be suspended' });
        return;
      }

      user.accountStatus = status;
      await user.save();

      await logAdminAction(
        req.user!,
        status === 'suspended' ? 'SUSPEND_USER' : 'ACTIVATE_USER',
        'User',
        user._id.toString(),
        { email: user.email, reason },
        req.ip
      );

      res.json({ success: true, message: `User status changed to ${status}`, data: user.toSafeObject() });
    } else {
      const user = inMemoryStore.users.find((u) => u._id === id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      if (user.role === 'admin' && status === 'suspended') {
        res.status(400).json({ success: false, message: 'Primary administrator accounts cannot be suspended' });
        return;
      }

      user.accountStatus = status;

      await logAdminAction(
        req.user!,
        status === 'suspended' ? 'SUSPEND_USER' : 'ACTIVATE_USER',
        'User',
        user._id,
        { email: user.email, reason },
        req.ip
      );

      const { passwordHash: _, ...safe } = user;
      res.json({ success: true, message: `User status changed to ${status}`, data: safe });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating user status' });
  }
};

export const getAllEnquiriesAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter: any = {};
      if (category) filter.category = category;
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { customerName: { $regex: search as string, $options: 'i' } },
          { email: { $regex: search as string, $options: 'i' } },
          { phone: { $regex: search as string, $options: 'i' } },
          { referenceId: { $regex: search as string, $options: 'i' } },
        ];
      }

      const enquiries = await Enquiry.find(filter)
        .populate('propertyId', 'title referenceId location pricing')
        .sort({ createdAt: -1 });

      res.json({ success: true, data: enquiries });
    } else {
      let list = [...inMemoryStore.enquiries];
      if (category) list = list.filter((e) => e.category === category);
      if (status) list = list.filter((e) => e.status === status);
      if (search) {
        const s = (search as string).toLowerCase();
        list = list.filter(
          (e) =>
            e.customerName.toLowerCase().includes(s) ||
            e.email.toLowerCase().includes(s) ||
            e.phone.toLowerCase().includes(s) ||
            e.referenceId.toLowerCase().includes(s)
        );
      }
      res.json({ success: true, data: list });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching enquiries' });
  }
};

export const updateEnquiryStatusAndNotes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, internalNotes, customerResponse, followUpAt } = req.body;

    if (mongoose.connection.readyState === 1) {
      const enquiry = await Enquiry.findById(id);
      if (!enquiry) {
        res.status(404).json({ success: false, message: 'Enquiry not found' });
        return;
      }

      if (status) enquiry.status = status;
      if (internalNotes !== undefined) enquiry.internalNotes = internalNotes;
      if (customerResponse !== undefined) enquiry.customerResponse = customerResponse;
      if (followUpAt !== undefined) enquiry.followUpAt = followUpAt ? new Date(followUpAt) : undefined;
      enquiry.assignedAdminId = new mongoose.Types.ObjectId(req.user?.userId);

      await enquiry.save();

      // If user is linked and customerResponse is provided, notify them!
      if (enquiry.userId && customerResponse) {
        await Notification.create({
          userId: enquiry.userId,
          title: 'Update on Your Enquiry',
          message: `Banashankari Enterprises responded to your enquiry (Ref: ${enquiry.referenceId}): "${customerResponse.slice(0, 80)}..."`,
          type: 'enquiry_update',
          link: '/dashboard/enquiries',
        });
      }

      await logAdminAction(
        req.user!,
        'UPDATE_ENQUIRY',
        'Enquiry',
        enquiry._id.toString(),
        { referenceId: enquiry.referenceId, status, hasInternalNotes: !!internalNotes },
        req.ip
      );

      res.json({ success: true, message: 'Enquiry updated successfully', data: enquiry });
    } else {
      const enquiry = inMemoryStore.enquiries.find((e) => e._id === id);
      if (!enquiry) {
        res.status(404).json({ success: false, message: 'Enquiry not found' });
        return;
      }

      if (status) enquiry.status = status;
      if (internalNotes !== undefined) enquiry.internalNotes = internalNotes;
      if (customerResponse !== undefined) enquiry.customerResponse = customerResponse;
      if (followUpAt !== undefined) enquiry.followUpAt = followUpAt;
      enquiry.updatedAt = new Date();

      if (enquiry.userId && customerResponse) {
        inMemoryStore.notifications.push({
          _id: new mongoose.Types.ObjectId().toString(),
          userId: enquiry.userId,
          title: 'Update on Your Enquiry',
          message: `Banashankari Enterprises responded to your enquiry (Ref: ${enquiry.referenceId}): "${customerResponse.slice(0, 80)}..."`,
          type: 'enquiry_update',
          link: '/dashboard/enquiries',
          isRead: false,
          createdAt: new Date(),
        });
      }

      await logAdminAction(
        req.user!,
        'UPDATE_ENQUIRY',
        'Enquiry',
        enquiry._id,
        { referenceId: enquiry.referenceId, status },
        req.ip
      );

      res.json({ success: true, message: 'Enquiry updated successfully', data: enquiry });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating enquiry' });
  }
};

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
      res.json({ success: true, data: logs });
    } else {
      res.json({ success: true, data: inMemoryStore.auditLogs.slice(0, 100) });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching audit logs' });
  }
};
