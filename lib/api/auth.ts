/**
 * Authentication API Endpoints
 * Based on MOBILE_APP_SPECS.md
 * Updated for OTP-based authentication
 */

import { apiClient } from './client';
import { Customer } from '../../types';

export interface SendOtpRequest {
  phone: string;
  tenantSlug: string;
}

export interface SendOtpResponse {
  message: string;
  expiresIn?: number; // OTP expiration time in seconds
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
  tenantSlug: string;
}

export interface VerifyOtpResponse {
  token: string;
  refreshToken?: string;
  user: Customer;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  tenantSlug: string;
}

export interface RegisterResponse {
  message: string;
  requiresOtpVerification: boolean;
}

export interface LoginRequest {
  phone: string;
  tenantSlug: string;
}

export interface LoginResponse {
  message: string;
  requiresOtpVerification: boolean;
}

/**
 * Send OTP to phone number (customer authentication)
 */
export async function sendCustomerOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
  return apiClient.post<SendOtpResponse>('/api/auth/customer/send-otp', data, false);
}

/**
 * Verify OTP and complete login/registration (customer authentication)
 */
export async function verifyCustomerOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  return apiClient.post<VerifyOtpResponse>('/api/auth/customer/verify-otp', data, false);
}

/**
 * Send OTP to phone number for login
 * @deprecated Use sendCustomerOtp instead
 */
export async function sendLoginOtp(data: LoginRequest): Promise<SendOtpResponse> {
  return sendCustomerOtp(data);
}

/**
 * Send OTP to phone number for registration
 * @deprecated Use sendCustomerOtp instead
 */
export async function sendRegisterOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
  return sendCustomerOtp(data);
}

/**
 * Verify OTP and complete login
 * @deprecated Use verifyCustomerOtp instead
 */
export async function verifyLoginOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  return verifyCustomerOtp(data);
}

/**
 * Register new customer (sends OTP)
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return apiClient.post<RegisterResponse>('/api/customers/register', data, false);
}

/**
 * Verify OTP and complete registration
 */
export async function verifyRegisterOtp(data: VerifyOtpRequest & { firstName?: string; lastName?: string; email?: string }): Promise<VerifyOtpResponse> {
  return apiClient.post<VerifyOtpResponse>('/api/customers/verify-register-otp', data, false);
}

/**
 * Customer logout
 */
export async function logout(): Promise<void> {
  return apiClient.post('/api/auth/customer-logout', {}, true);
}
