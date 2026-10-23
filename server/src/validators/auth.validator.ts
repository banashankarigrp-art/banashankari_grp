import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .preprocess((v) => (typeof v === 'string' ? v.trim() : v), z.string().min(2, 'Name must be at least 2 characters').max(100)),
  email: z
    .preprocess(
      (v) => (typeof v === 'string' ? v.trim().toLowerCase() : v),
      z.string().email('Please enter a valid email address')
    ),
  phone: z
    .preprocess(
      (v) => (typeof v === 'string' ? v.trim() : v),
      z.string().min(6, 'Please enter a valid phone number (at least 6 digits)')
    ),
  role: z
    .preprocess(
      (v) => (v === 'seller' ? 'seller' : 'customer'),
      z.enum(['customer', 'seller'])
    ),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
  agreeToTerms: z.any().optional(),
}).refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});
