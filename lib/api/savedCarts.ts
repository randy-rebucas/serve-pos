/**
 * Saved Carts API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';
import { OrderItem } from '../../types';

export interface SavedCart {
  _id: string;
  customerId?: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  discountCode?: string;
  discountAmount?: number;
  tax?: number;
  total: number;
  name?: string; // Custom name for the saved cart
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedCartsQueryParams {
  customerId?: string;
  customerEmail?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateSavedCartRequest {
  customerId?: string;
  customerEmail?: string;
  items: OrderItem[];
  subtotal: number;
  discountCode?: string;
  discountAmount?: number;
  tax?: number;
  total: number;
  name?: string;
  notes?: string;
}

export interface UpdateSavedCartRequest {
  items?: OrderItem[];
  subtotal?: number;
  discountCode?: string;
  discountAmount?: number;
  tax?: number;
  total?: number;
  name?: string;
  notes?: string;
}

/**
 * Get all saved carts
 */
export async function getSavedCarts(params?: SavedCartsQueryParams): Promise<SavedCart[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.customerId) queryParams.append('customerId', params.customerId);
  if (params?.customerEmail) queryParams.append('customerEmail', params.customerEmail);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/saved-carts${query ? `?${query}` : ''}`;
  
  return apiClient.get<SavedCart[]>(endpoint, true);
}

/**
 * Get saved cart by ID
 */
export async function getSavedCartById(id: string): Promise<SavedCart> {
  return apiClient.get<SavedCart>(`/api/saved-carts/${id}`, true);
}

/**
 * Create/save cart
 */
export async function createSavedCart(data: CreateSavedCartRequest): Promise<SavedCart> {
  return apiClient.post<SavedCart>('/api/saved-carts', data, true);
}

/**
 * Update saved cart
 */
export async function updateSavedCart(id: string, data: UpdateSavedCartRequest): Promise<SavedCart> {
  return apiClient.put<SavedCart>(`/api/saved-carts/${id}`, data, true);
}

/**
 * Delete saved cart
 */
export async function deleteSavedCart(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/saved-carts/${id}`, true);
}
