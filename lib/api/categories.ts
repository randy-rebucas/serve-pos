/**
 * Categories API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesQueryParams {
  tenantSlug?: string;
  isActive?: boolean;
  search?: string;
  parentId?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive?: boolean;
}

/**
 * Get all categories
 */
export async function getCategories(params?: CategoriesQueryParams): Promise<Category[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.tenantSlug) queryParams.append('tenantSlug', params.tenantSlug);
  if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
  if (params?.search) queryParams.append('search', params.search);
  if (params?.parentId) queryParams.append('parentId', params.parentId);

  const query = queryParams.toString();
  const endpoint = `/api/categories${query ? `?${query}` : ''}`;
  
  return apiClient.get<Category[]>(endpoint, false);
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<Category> {
  return apiClient.get<Category>(`/api/categories/${id}`, false);
}

/**
 * Create category
 */
export async function createCategory(data: CreateCategoryRequest): Promise<Category> {
  return apiClient.post<Category>('/api/categories', data, true);
}

/**
 * Update category
 */
export async function updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
  return apiClient.put<Category>(`/api/categories/${id}`, data, true);
}

/**
 * Delete category
 */
export async function deleteCategory(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/categories/${id}`, true);
}
