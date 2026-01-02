/**
 * Zod Validation Schemas
 * Form validation schemas using Zod
 */

import { z } from 'zod';

/**
 * Phone number validation helper
 */
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
const phoneNumberSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number')
  .refine((val) => {
    // Remove formatting characters and check length
    const digits = val.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }, 'Phone number must be between 10 and 15 digits');

/**
 * OTP validation schema
 */
export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

export type OtpFormData = z.infer<typeof otpSchema>;

/**
 * Login form schema (phone number only)
 */
export const loginSchema = z.object({
  phone: phoneNumberSchema,
  tenantSlug: z.string().min(1, 'Tenant slug is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login with OTP schema
 */
export const loginOtpSchema = z.object({
  phone: phoneNumberSchema,
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
  tenantSlug: z.string().min(1, 'Tenant slug is required'),
});

export type LoginOtpFormData = z.infer<typeof loginOtpSchema>;

/**
 * Registration form schema (phone-based, no password)
 */
export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: phoneNumberSchema,
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  tenantSlug: z.string().min(1, 'Tenant slug is required'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Registration with OTP schema
 */
export const registerOtpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: phoneNumberSchema,
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  tenantSlug: z.string().min(1, 'Tenant slug is required'),
});

export type RegisterOtpFormData = z.infer<typeof registerOtpSchema>;

/**
 * Booking form schema
 */
export const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerPhone: z.string().min(10, 'Please enter a valid phone number'),
  serviceName: z.string().min(1, 'Service is required'),
  startTime: z.string().min(1, 'Date and time are required'),
  duration: z.number().min(1, 'Duration is required'),
  staffId: z.string().optional(),
  notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

/**
 * Profile update schema
 */
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
