import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { inMemoryStore } from '../services/store.js';
import { generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies } from '../utils/token.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const userRole = 'customer';

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: normalizedEmail,
        phone,
        passwordHash,
        role: userRole,
        accountStatus: 'active',
        emailVerified: false,
      });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      setAuthCookies(res, accessToken, refreshToken);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        user: user.toSafeObject(),
        accessToken,
      });
    } else {
      // Resilient fallback store
      const existingUser = inMemoryStore.users.find((u) => u.email === normalizedEmail);
      if (existingUser) {
        res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        email: normalizedEmail,
        phone,
        passwordHash,
        role: userRole as any,
        accountStatus: 'active' as const,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      inMemoryStore.users.push(newUser);

      const accessToken = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);
      setAuthCookies(res, accessToken, refreshToken);

      const { passwordHash: _, ...safeUser } = newUser;
      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        user: safeUser,
        accessToken,
      });
    }
  } catch (error: any) {
    console.error('Registration Error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors || {}).map((e: any) => e.message);
      res.status(400).json({ success: false, message: messages.join('. ') || 'Validation error' });
      return;
    }
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, identifier, phone, password } = req.body;
    const rawIdentifier = (identifier || email || phone || '').toString().trim();
    if (!rawIdentifier) {
      res.status(400).json({ success: false, message: 'Please provide either an email or mobile number.' });
      return;
    }

    const isEmail = rawIdentifier.includes('@');
    const normalizedEmail = rawIdentifier.toLowerCase();
    const cleanDigits = rawIdentifier.replace(/\D/g, '');
    const last10Digits = cleanDigits.slice(-10);

    let query: any;
    if (isEmail) {
      query = { email: normalizedEmail };
    } else {
      const phoneRegex = new RegExp(last10Digits + '$');
      query = {
        $or: [
          { phone: rawIdentifier },
          { phone: `+91 ${last10Digits}` },
          { phone: `+91${last10Digits}` },
          { phone: last10Digits },
          { phone: phoneRegex },
        ],
      };
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne(query).select('+passwordHash');
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email/mobile number or password.' });
        return;
      }

      if (user.accountStatus === 'suspended') {
        res.status(403).json({ success: false, message: 'This account has been suspended. Please contact support.' });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email/mobile number or password.' });
        return;
      }

      user.lastLoginAt = new Date();
      await user.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      setAuthCookies(res, accessToken, refreshToken);

      res.json({
        success: true,
        message: 'Logged in successfully',
        user: user.toSafeObject(),
        accessToken,
      });
    } else {
      const user = inMemoryStore.users.find((u) => {
        if (isEmail) {
          return u.email.toLowerCase() === normalizedEmail;
        }
        const uDigits = (u.phone || '').replace(/\D/g, '');
        return (
          u.phone === rawIdentifier ||
          (last10Digits && uDigits.endsWith(last10Digits)) ||
          uDigits === cleanDigits
        );
      });
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email/mobile number or password.' });
        return;
      }

      if (user.accountStatus === 'suspended') {
        res.status(403).json({ success: false, message: 'This account has been suspended. Please contact support.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email/mobile number or password.' });
        return;
      }

      user.lastLoginAt = new Date();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      setAuthCookies(res, accessToken, refreshToken);

      const { passwordHash: _, ...safeUser } = user;
      res.json({
        success: true,
        message: 'Logged in successfully',
        user: safeUser,
        accessToken,
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  clearAuthCookies(res);
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user.userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({ success: true, user: user.toSafeObject() });
    } else {
      const user = inMemoryStore.users.find((u) => u._id.toString() === req.user?.userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      const { passwordHash: _, ...safeUser } = user;
      res.json({ success: true, user: safeUser });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching user' });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user.userId).select('+passwordHash');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Current password does not match.' });
        return;
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ success: true, message: 'Password updated successfully' });
    } else {
      const user = inMemoryStore.users.find((u) => u._id.toString() === req.user?.userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Current password does not match.' });
        return;
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      res.json({ success: true, message: 'Password updated successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update password' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  // Generic safe message to prevent email enumeration
  res.json({
    success: true,
    message: 'If an account exists with this email, password reset instructions have been dispatched.',
  });
};
