import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { SiteSettings } from '../models/SiteSettings.js';
import { ConstructionProject } from '../models/ConstructionProject.js';
import { Testimonial } from '../models/Testimonial.js';
import { inMemoryStore } from '../services/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getSiteSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = await SiteSettings.create(inMemoryStore.settings);
      }
      res.json({ success: true, data: settings });
    } else {
      res.json({ success: true, data: inMemoryStore.settings });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching site settings' });
  }
};

export const updateSiteSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = new SiteSettings(req.body);
      } else {
        Object.assign(settings, req.body);
      }
      settings.updatedBy = new mongoose.Types.ObjectId(req.user?.userId);
      await settings.save();
      res.json({ success: true, message: 'Website settings updated successfully', data: settings });
    } else {
      Object.assign(inMemoryStore.settings, req.body);
      res.json({ success: true, message: 'Website settings updated successfully', data: inMemoryStore.settings });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating settings' });
  }
};

export const getConstructionProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const projects = await ConstructionProject.find().sort({ isFeatured: -1, createdAt: -1 });
      res.json({ success: true, data: projects });
    } else {
      res.json({ success: true, data: inMemoryStore.projects });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching projects' });
  }
};

export const createConstructionProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const project = await ConstructionProject.create(req.body);
      res.status(201).json({ success: true, message: 'Project added to portfolio', data: project });
    } else {
      const newProj = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryStore.projects.push(newProj);
      res.status(201).json({ success: true, message: 'Project added to portfolio', data: newProj });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating project' });
  }
};

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      const testimonials = await Testimonial.find({ isApproved: true }).sort({ isFeatured: -1, createdAt: -1 });
      res.json({ success: true, data: testimonials });
    } else {
      const list = inMemoryStore.testimonials.filter((t) => t.isApproved);
      res.json({ success: true, data: list });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching testimonials' });
  }
};
