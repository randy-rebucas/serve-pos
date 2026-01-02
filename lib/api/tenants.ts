/**
 * Tenants API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface Tenant {
  _id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  businessType?: string;
  isActive: boolean;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSettings {
  currency: string;
  timezone: string;
  taxEnabled: boolean;
  receiptEnabled: boolean;
  notificationsEnabled: boolean;
  [key: string]: any;
}

export interface BusinessHours {
  monday?: { open: string; close: string; closed?: boolean };
  tuesday?: { open: string; close: string; closed?: boolean };
  wednesday?: { open: string; close: string; closed?: boolean };
  thursday?: { open: string; close: string; closed?: boolean };
  friday?: { open: string; close: string; closed?: boolean };
  saturday?: { open: string; close: string; closed?: boolean };
  sunday?: { open: string; close: string; closed?: boolean };
}

export interface Holiday {
  _id: string;
  name: string;
  date: string; // ISO date
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeRate {
  currency: string;
  rate: number;
  updatedAt: string;
}

export interface ReceiptTemplate {
  header?: string;
  footer?: string;
  showTax?: boolean;
  showDiscount?: boolean;
  logo?: string;
}

export interface NotificationTemplate {
  bookingConfirmation?: string;
  bookingReminder?: string;
  orderConfirmation?: string;
  [key: string]: string | undefined;
}

export interface TenantSignupRequest {
  name: string;
  slug: string;
  email: string;
  password: string;
  businessType?: string;
}

/**
 * Get tenant by slug (public)
 */
export async function getTenantBySlug(slug: string): Promise<Tenant> {
  return apiClient.get<Tenant>(`/api/tenants/${slug}`, false);
}

/**
 * Get all tenants (admin only)
 */
export async function getTenants(): Promise<Tenant[]> {
  return apiClient.get<Tenant[]>('/api/tenants', true);
}

/**
 * Create tenant (admin only)
 */
export async function createTenant(data: TenantSignupRequest): Promise<Tenant> {
  return apiClient.post<Tenant>('/api/tenants', data, true);
}

/**
 * Tenant signup (public)
 */
export async function tenantSignup(data: TenantSignupRequest): Promise<Tenant> {
  return apiClient.post<Tenant>('/api/tenants/signup', data, false);
}

/**
 * Update tenant (admin only)
 */
export async function updateTenant(slug: string, data: Partial<Tenant>): Promise<Tenant> {
  return apiClient.put<Tenant>(`/api/tenants/${slug}`, data, true);
}

/**
 * Get tenant settings
 */
export async function getTenantSettings(slug: string): Promise<TenantSettings> {
  return apiClient.get<TenantSettings>(`/api/tenants/${slug}/settings`, true);
}

/**
 * Update tenant settings
 */
export async function updateTenantSettings(slug: string, data: Partial<TenantSettings>): Promise<TenantSettings> {
  return apiClient.put<TenantSettings>(`/api/tenants/${slug}/settings`, data, true);
}

/**
 * Get business hours
 */
export async function getBusinessHours(slug: string): Promise<BusinessHours> {
  return apiClient.get<BusinessHours>(`/api/tenants/${slug}/business-hours`, true);
}

/**
 * Update business hours
 */
export async function updateBusinessHours(slug: string, data: BusinessHours): Promise<BusinessHours> {
  return apiClient.put<BusinessHours>(`/api/tenants/${slug}/business-hours`, data, true);
}

/**
 * Get holidays
 */
export async function getHolidays(slug: string): Promise<Holiday[]> {
  return apiClient.get<Holiday[]>(`/api/tenants/${slug}/holidays`, true);
}

/**
 * Create holiday
 */
export async function createHoliday(slug: string, data: { name: string; date: string; isRecurring?: boolean }): Promise<Holiday> {
  return apiClient.post<Holiday>(`/api/tenants/${slug}/holidays`, data, true);
}

/**
 * Update holiday
 */
export async function updateHoliday(slug: string, holidayId: string, data: Partial<Holiday>): Promise<Holiday> {
  return apiClient.put<Holiday>(`/api/tenants/${slug}/holidays/${holidayId}`, data, true);
}

/**
 * Delete holiday
 */
export async function deleteHoliday(slug: string, holidayId: string): Promise<void> {
  return apiClient.delete<void>(`/api/tenants/${slug}/holidays/${holidayId}`, true);
}

/**
 * Get tenant tax rules
 */
export async function getTenantTaxRules(slug: string): Promise<any[]> {
  return apiClient.get<any[]>(`/api/tenants/${slug}/tax-rules`, true);
}

/**
 * Get exchange rates
 */
export async function getExchangeRates(slug: string): Promise<ExchangeRate[]> {
  return apiClient.get<ExchangeRate[]>(`/api/tenants/${slug}/exchange-rates`, true);
}

/**
 * Update exchange rates
 */
export async function updateExchangeRates(slug: string, data: ExchangeRate[]): Promise<ExchangeRate[]> {
  return apiClient.put<ExchangeRate[]>(`/api/tenants/${slug}/exchange-rates`, data, true);
}

/**
 * Get receipt templates
 */
export async function getReceiptTemplates(slug: string): Promise<ReceiptTemplate> {
  return apiClient.get<ReceiptTemplate>(`/api/tenants/${slug}/receipt-templates`, true);
}

/**
 * Update receipt templates
 */
export async function updateReceiptTemplates(slug: string, data: Partial<ReceiptTemplate>): Promise<ReceiptTemplate> {
  return apiClient.put<ReceiptTemplate>(`/api/tenants/${slug}/receipt-templates`, data, true);
}

/**
 * Get notification templates
 */
export async function getNotificationTemplates(slug: string): Promise<NotificationTemplate> {
  return apiClient.get<NotificationTemplate>(`/api/tenants/${slug}/notification-templates`, true);
}

/**
 * Update notification templates
 */
export async function updateNotificationTemplates(slug: string, data: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
  return apiClient.put<NotificationTemplate>(`/api/tenants/${slug}/notification-templates`, data, true);
}

/**
 * Reset tenant collections (admin only)
 */
export async function resetTenantCollections(slug: string): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>(`/api/tenants/${slug}/reset-collections`, {}, true);
}
