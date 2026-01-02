/**
 * Users API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'owner' | 'admin' | 'manager' | 'cashier' | 'viewer';
  isActive: boolean;
  pin?: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersQueryParams {
  search?: string;
  role?: User['role'];
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: User['role'];
  password?: string;
  pin?: string;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: User['role'];
  isActive?: boolean;
}

export interface SetPinRequest {
  pin: string;
}

/**
 * Get all users
 */
export async function getUsers(params?: UsersQueryParams): Promise<User[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.role) queryParams.append('role', params.role);
  if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/users${query ? `?${query}` : ''}`;
  
  return apiClient.get<User[]>(endpoint, true);
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User> {
  return apiClient.get<User>(`/api/users/${id}`, true);
}

/**
 * Create user
 */
export async function createUser(data: CreateUserRequest): Promise<User> {
  return apiClient.post<User>('/api/users', data, true);
}

/**
 * Update user
 */
export async function updateUser(id: string, data: UpdateUserRequest): Promise<User> {
  return apiClient.put<User>(`/api/users/${id}`, data, true);
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/users/${id}`, true);
}

/**
 * Set/update user PIN
 */
export async function setUserPin(id: string, data: SetPinRequest): Promise<void> {
  return apiClient.post<void>(`/api/users/${id}/pin`, data, true);
}

/**
 * Update own PIN
 */
export async function updateOwnPin(data: SetPinRequest): Promise<void> {
  return apiClient.post<void>('/api/users/pin', data, true);
}

/**
 * Get user QR code
 */
export async function getUserQrCode(id: string): Promise<{ qrCode: string }> {
  return apiClient.get<{ qrCode: string }>(`/api/users/${id}/qr-code`, true);
}
