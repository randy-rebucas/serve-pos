/**
 * Discounts API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface Discount {
  _id: string;
  code: string;
  name?: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  usageCount?: number;
  isActive: boolean;
  appliesTo?: 'all' | 'products' | 'services' | 'categories';
  categoryIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscountsQueryParams {
  search?: string;
  isActive?: boolean;
  code?: string;
  page?: number;
  limit?: number;
}

export interface CreateDiscountRequest {
  code: string;
  name?: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  isActive?: boolean;
  appliesTo?: 'all' | 'products' | 'services' | 'categories';
  categoryIds?: string[];
}

export interface UpdateDiscountRequest {
  name?: string;
  description?: string;
  type?: 'percentage' | 'fixed';
  value?: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  isActive?: boolean;
  appliesTo?: 'all' | 'products' | 'services' | 'categories';
  categoryIds?: string[];
}

export interface ValidateDiscountRequest {
  code: string;
  amount: number;
}

export interface ValidateDiscountResponse {
  valid: boolean;
  discountAmount?: number;
  message?: string;
}

/**
 * Get all discounts
 */
export async function getDiscounts(params?: DiscountsQueryParams): Promise<Discount[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
  if (params?.code) queryParams.append('code', params.code);
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/discounts${query ? `?${query}` : ''}`;
  
  return apiClient.get<Discount[]>(endpoint, true);
}

/**
 * Get discount by ID
 */
export async function getDiscountById(id: string): Promise<Discount> {
  return apiClient.get<Discount>(`/api/discounts/${id}`, true);
}

/**
 * Create discount
 */
export async function createDiscount(data: CreateDiscountRequest): Promise<Discount> {
  return apiClient.post<Discount>('/api/discounts', data, true);
}

/**
 * Update discount
 */
export async function updateDiscount(id: string, data: UpdateDiscountRequest): Promise<Discount> {
  return apiClient.put<Discount>(`/api/discounts/${id}`, data, true);
}

/**
 * Delete discount
 */
export async function deleteDiscount(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/discounts/${id}`, true);
}

/**
 * Validate discount code (public)
 */
export async function validateDiscountCode(
  data: ValidateDiscountRequest
): Promise<ValidateDiscountResponse> {
  return apiClient.post<ValidateDiscountResponse>('/api/discounts/validate', data, false);
}
