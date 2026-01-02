/**
 * Branches API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface Branch {
  _id: string;
  name: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BranchesQueryParams {
  search?: string;
  isActive?: boolean;
}

export interface CreateBranchRequest {
  name: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  isActive?: boolean;
}

export interface UpdateBranchRequest {
  name?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  isActive?: boolean;
}

/**
 * Get all branches
 */
export async function getBranches(params?: BranchesQueryParams): Promise<Branch[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));

  const query = queryParams.toString();
  const endpoint = `/api/branches${query ? `?${query}` : ''}`;
  
  return apiClient.get<Branch[]>(endpoint, true);
}

/**
 * Get branch by ID
 */
export async function getBranchById(id: string): Promise<Branch> {
  return apiClient.get<Branch>(`/api/branches/${id}`, true);
}

/**
 * Create branch
 */
export async function createBranch(data: CreateBranchRequest): Promise<Branch> {
  return apiClient.post<Branch>('/api/branches', data, true);
}

/**
 * Update branch
 */
export async function updateBranch(id: string, data: UpdateBranchRequest): Promise<Branch> {
  return apiClient.put<Branch>(`/api/branches/${id}`, data, true);
}
