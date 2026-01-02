/**
 * Bundles API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';
import { Product } from '../../types';

export interface Bundle {
  _id: string;
  name: string;
  description?: string;
  products: Array<{
    productId: string;
    product: Product;
    quantity: number;
  }>;
  price: number;
  discount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BundlesQueryParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateBundleRequest {
  name: string;
  description?: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  price: number;
  discount?: number;
  isActive?: boolean;
}

export interface UpdateBundleRequest {
  name?: string;
  description?: string;
  products?: Array<{
    productId: string;
    quantity: number;
  }>;
  price?: number;
  discount?: number;
  isActive?: boolean;
}

export interface BundleAnalytics {
  totalSold: number;
  totalRevenue: number;
  averageOrderValue: number;
  topBundles: Array<{
    bundleId: string;
    bundleName: string;
    quantity: number;
    revenue: number;
  }>;
}

/**
 * Get all bundles
 */
export async function getBundles(params?: BundlesQueryParams): Promise<Bundle[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/bundles${query ? `?${query}` : ''}`;
  
  return apiClient.get<Bundle[]>(endpoint, true);
}

/**
 * Get bundle by ID
 */
export async function getBundleById(id: string): Promise<Bundle> {
  return apiClient.get<Bundle>(`/api/bundles/${id}`, true);
}

/**
 * Create bundle
 */
export async function createBundle(data: CreateBundleRequest): Promise<Bundle> {
  return apiClient.post<Bundle>('/api/bundles', data, true);
}

/**
 * Update bundle
 */
export async function updateBundle(id: string, data: UpdateBundleRequest): Promise<Bundle> {
  return apiClient.put<Bundle>(`/api/bundles/${id}`, data, true);
}

/**
 * Delete bundle
 */
export async function deleteBundle(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/bundles/${id}`, true);
}

/**
 * Get bundle analytics
 */
export async function getBundleAnalytics(params?: { startDate?: string; endDate?: string }): Promise<BundleAnalytics> {
  const queryParams = new URLSearchParams();
  
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);

  const query = queryParams.toString();
  const endpoint = `/api/bundles/analytics${query ? `?${query}` : ''}`;
  
  return apiClient.get<BundleAnalytics>(endpoint, true);
}

/**
 * Bulk create/update bundles
 */
export async function bulkBundles(data: { bundles: CreateBundleRequest[] }): Promise<Bundle[]> {
  return apiClient.post<Bundle[]>('/api/bundles/bulk', data, true);
}
