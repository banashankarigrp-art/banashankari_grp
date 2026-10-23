import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/token.js';
import { User } from '../models/User.js';
import mongoose from 'mongoose';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'customer' | 'seller' | 'admin';
    name?: string;
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies?.access_token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
      return;
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
      return;
    }

    // If MongoDB is connected, verify user still exists and is active
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(payload.userId).select('accountStatus name role email');
      if (!user) {
        res.status(401).json({ success: false, message: 'User account no longer exists.' });
        return;
      }
      if (user.accountStatus === 'suspended') {
        res.status(403).json({ success: false, message: 'Account is suspended. Contact support.' });
        return;
      }
      req.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      };
    } else {
      req.user = payload;
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Authentication failed.' });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Access denied. Administrative privileges required.' });
    return;
  }
  next();
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  let token = req.cookies?.access_token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
};
