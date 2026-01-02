/**
 * Customers API Endpoints
 * Based on MOBILE_APP_SPECS.md
 */

import { apiClient } from './client';
import { Customer, Address } from '../../types';

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  addresses?: Address[];
  dateOfBirth?: string;
}

/**
 * Get customer profile
 */
export async function getCustomer(id: string): Promise<Customer> {
  return apiClient.get<Customer>(`/api/customers/${id}`, true);
}

/**
 * Update customer profile
 */
export async function updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer> {
  return apiClient.put<Customer>(`/api/customers/${id}`, data, true);
}
