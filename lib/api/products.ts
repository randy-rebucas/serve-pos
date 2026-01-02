/**
 * Products API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';
import { Product } from '../../types';

export interface ProductsQueryParams {
  tenantSlug?: string;
  isActive?: boolean;
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  category?: string;
  categoryId?: string;
  image?: string;
  images?: string[];
  productType?: 'regular' | 'bundle' | 'service';
  hasVariations?: boolean;
  variations?: Array<{
    size?: string;
    color?: string;
    type?: string;
    sku?: string;
    price?: number;
    stock?: number;
  }>;
  isActive?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  sku?: string;
  category?: string;
  categoryId?: string;
  image?: string;
  images?: string[];
  productType?: 'regular' | 'bundle' | 'service';
  hasVariations?: boolean;
  variations?: Array<{
    size?: string;
    color?: string;
    type?: string;
    sku?: string;
    price?: number;
    stock?: number;
  }>;
  isActive?: boolean;
}

export interface RefillProductRequest {
  quantity: number;
  reason?: string;
}

/**
 * Get all products
 */
export async function getProducts(params?: ProductsQueryParams): Promise<Product[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.tenantSlug) queryParams.append('tenantSlug', params.tenantSlug);
  if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
  if (params?.search) queryParams.append('search', params.search);
  if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/products${query ? `?${query}` : ''}`;
  
  return apiClient.get<Product[]>(endpoint, false);
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product> {
  return apiClient.get<Product>(`/api/products/${id}`, false);
}

/**
 * Create product
 */
export async function createProduct(data: CreateProductRequest): Promise<Product> {
  return apiClient.post<Product>('/api/products', data, true);
}

/**
 * Update product
 */
export async function updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
  return apiClient.put<Product>(`/api/products/${id}`, data, true);
}

/**
 * Delete product
 */
export async function deleteProduct(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/products/${id}`, true);
}

/**
 * Refill product stock
 */
export async function refillProduct(id: string, data: RefillProductRequest): Promise<Product> {
  return apiClient.post<Product>(`/api/products/${id}/refill`, data, true);
}

/**
 * Pin/unpin product
 */
export async function pinProduct(id: string, pinned: boolean): Promise<Product> {
  return apiClient.post<Product>(`/api/products/${id}/pin`, { pinned }, true);
}
